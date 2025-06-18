import functions_framework
import pandas as pd
from flask import jsonify
from google.cloud import storage

# Load CSV from Cloud Storage
def load_csv_from_storage():
    client = storage.Client()
    bucket = client.bucket('hsn_csv')
    blob = bucket.blob('hsn_lookup.csv')
    
    # Download to memory and load with pandas
    csv_data = blob.download_as_text()
    from io import StringIO
    return pd.read_csv(StringIO(csv_data))

df = load_csv_from_storage()
print(f"CSV loaded successfully. Total rows: {len(df)}")

@functions_framework.http
def hsn_lookup(request):
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # CORS headers for actual request
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
    
    try:
        # Get HSN code from query parameter
        hsn_code = request.args.get('hsn_code')
        
        if not hsn_code:
            return jsonify({'error': 'hsn_code parameter is required'}), 400, headers
        
        print(f"Searching for HSN code: {hsn_code}")
        
        # Check if it's a 4-digit number (prefix search)
        if len(hsn_code) == 4 and hsn_code.isdigit():
            # Find all HSN codes that start with this 4-digit prefix
            filtered_df = df[df['HSN_CD'].astype(str).str.startswith(hsn_code)]
            
            if filtered_df.empty:
                print(f"No data found for HSN prefix: {hsn_code}")
                return jsonify({'error': 'No HSN codes found with this prefix'}), 404, headers
            
            # Return multiple results for prefix search
            results = []
            for _, record in filtered_df.iterrows():
                results.append({
                    'hsn_code': str(record['HSN_CD']),
                    'description': str(record['HSN_Description']),
                    'gst_rate': f"{record['Rate']}%"
                })
            
            # Sort by HSN code
            results.sort(key=lambda x: x['hsn_code'])
            
            # Limit to first 20 results to avoid too much data
            response_data = {
                'type': 'prefix_search',
                'prefix': hsn_code,
                'total_found': len(results),
                'results': results[:20]  # Limit to 20 results
            }
            
            print(f"Found {len(results)} records for prefix {hsn_code}")
            return jsonify(response_data), 200, headers
            
        else:
            # Exact search for non-4-digit codes
            filtered_df = df[df['HSN_CD'].astype(str) == str(hsn_code)]
            
            if filtered_df.empty:
                print(f"No data found for HSN code: {hsn_code}")
                return jsonify({'error': 'HSN code not found'}), 404, headers
            
            # Get the first matching record for exact search
            record = filtered_df.iloc[0]
            
            response_data = {
                'type': 'exact_search',
                'hsn_code': str(record['HSN_CD']),
                'description': str(record['HSN_Description']),
                'gst_rate': f"{record['Rate']}%"
            }
            
            print(f"Found exact record: {response_data}")
            return jsonify(response_data), 200, headers
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500, headers