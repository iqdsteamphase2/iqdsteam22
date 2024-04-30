import json
import boto3

def lambda_handler(event, context):
    clientName = event.get("queryStringParameters", {}).get("clientName")
    productName = event.get("queryStringParameters", {}).get("productName")

    # Initialize DynamoDB client
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(clientName+"-"+productName+"-Results")

    print(table)

    # Query DynamoDB table
    response = table.scan()

    # Parse and format data
    parsed_data = []
    for item in response['Items']:
        parsed_item = {
            'ImageName': item['ImageName'],
            'ARN': item['ARN'],
            'Day': int(item['Day']),
            'Hour': int(item['Hour']),
            'Labels': list(json.loads(item['Labels'])) if isinstance(item['Labels'], str) else list(item['Labels']),
            'Minute': int(item['Minute']),
            'Month': int(item['Month']),
            'S3_URI': item['S3 URI'],
            'Second': int(item['Second']),
            'URL': item['URL'],
            'Year': int(item['Year'])
        }
        parsed_data.append(parsed_item)

    # Add CORS headers to the response
    headers = {
        'Access-Control-Allow-Origin': '*',  # Replace * with your allowed origin if needed
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET'
    }

    # Return parsed data with CORS headers
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(parsed_data)
    }
