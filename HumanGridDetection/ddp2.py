from MeteorClient import MeteorClient

client = MeteorClient('ws://127.0.0.1:3000/websocket')

def connected(self):
    print('> CONNECTED')

client.on('connected', connected)

client.connect()

print("Meteor connecting...")

def callback(error, result):
    print("> CALLBACK")

    if error:
        print(error)
        return

    print(result)

client.call('activate-position', [0, 0, 1], callback)
print("Activation function called.")

client.call('deactivate-position', [0, 0, 1], callback)
print("Deactivation function called.")

client.close()

