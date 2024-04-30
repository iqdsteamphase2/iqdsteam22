import json
import paramiko

def lambda_handler(event, context):

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    server = 'us2.pitunnel.com'
    port = 20318
    username = 'rnibu'
    password = 'securityfirst'

    ssh.connect(server, username=username, password=password, port=port)
    
    clientName = event.get("queryStringParameters", {}).get("clientName")
    productName = event.get("queryStringParameters", {}).get("productName")
    
    command = 'python ~/Desktop/IQDS/time/timelapse/onepicturenew.py'+" "+clientName+" "+productName
    print(command)
    ssh.exec_command(command)
    
    # Add CORS headers to the response
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'  # Change * to specific origin if needed
    }
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps('Hello from Lambda!')
    }
