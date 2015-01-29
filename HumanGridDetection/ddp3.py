from meteor import Meteor
import time

client = Meteor.DDPClient('ws://127.0.0.1:3000/websocket')


def callback(error, response):
    print("> CALLBACK")
    if error:
        print("Error: ", error)
    else:
        print("Response: ", response)

def connected():
    print('> CONNECTED')

    client.call('activate-position', [0, 0, 1], callback)
    print("Activation function called.")

    client.call('deactivate-position', [0, 0, 1], callback)
    print("Deactivation function called.")


if __name__ == '__main__':
    client.on('connected', connected)

    client.connect()

    print("Meteor connecting...")

    # (sort of) hacky way to keep the client alive
    # ctrl + c to kill the script
    while True:
        try:
            time.sleep(1)
        except KeyboardInterrupt:
            break

