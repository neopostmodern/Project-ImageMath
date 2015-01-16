from DDPClient import DDPClient

client = DDPClient('ws://127.0.0.1:3000/websocket')
client.connect()

print("Meteor connected.")

def callback():
    print("Callback.")

# client.call('activate-position', [0, 0, 1], callback)
# print("Activation function called.")

client.call('deactivate-position', [0, 0, 1], callback)
print("Deactivation function called.")

client.close()

