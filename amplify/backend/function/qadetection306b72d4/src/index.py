import json
import paramiko

def lambda_handler(event, context):

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    server = 'us2.pitunnel.com'
    port = 20318
    username = 'rnibu'
    password = 'securityfirst'

    try:
        ssh.connect(server, username=username, password=password, port=port)
        ssh.exec_command('python ~/Desktop/IQDS/time/timelapse/onepicturenew.py')

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # This should be restricted to your domain in production
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps('Hello from Lambda!')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',  # This should be restricted to your domain in production
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps('Error: {}'.format(e))
        }
    finally:
        ssh.close()
