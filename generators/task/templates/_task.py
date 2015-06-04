from org.apache.samza.system import OutgoingMessageEnvelope, SystemStream

class <%= taskName %>():
    def init(self, config, context):
        self.output = SystemStream("kafka", config.get("rico.streams.out").replace("kafka.", ""))
        print("jython : Init config : " + str(config))
        print("jython : Init context : "  + str(context))

    def process(self, data, collector, coord):
        # print("Processsing : " +  str(data))
        collector.send(OutgoingMessageEnvelope(self.output, data.message))

    def window(self, collector, coord):
        print("Window yay!")

    def close(self):
        print("Close!")