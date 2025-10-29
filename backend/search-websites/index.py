import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Search websites in database by query string
    Args: event with httpMethod, queryStringParameters.q
          context with request_id
    Returns: HTTP response with matching websites
    '''
    method: str = event.get('httpMethod', 'GET')
    
    # Handle CORS OPTIONS request
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    # Get search query
    params = event.get('queryStringParameters') or {}
    query = params.get('q', '').strip()
    
    if not query:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Query parameter q is required'})
        }
    
    # Connect to database
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database connection not configured'})
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    # Search in title, url, and description (case-insensitive)
    search_pattern = f'%{query}%'
    cursor.execute(
        '''
        SELECT url, title, description, category, favicon_url
        FROM websites
        WHERE LOWER(title) LIKE LOWER(%s)
           OR LOWER(url) LIKE LOWER(%s)
           OR LOWER(description) LIKE LOWER(%s)
        ORDER BY 
            CASE 
                WHEN LOWER(title) LIKE LOWER(%s) THEN 1
                WHEN LOWER(url) LIKE LOWER(%s) THEN 2
                ELSE 3
            END,
            title
        LIMIT 20
        ''',
        (search_pattern, search_pattern, search_pattern, search_pattern, search_pattern)
    )
    
    results = []
    for row in cursor.fetchall():
        results.append({
            'url': row[0],
            'title': row[1],
            'description': row[2],
            'category': row[3],
            'favicon_url': row[4]
        })
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'query': query,
            'results': results,
            'count': len(results)
        })
    }
