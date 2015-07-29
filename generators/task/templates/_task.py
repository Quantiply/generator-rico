from com.quantiply.samza.task import BaseTask
from org.apache.samza.system import OutgoingMessageEnvelope

class <%= taskName %>(BaseTask):
  
  def _init(self, config, context, metric_adaptor):
    self.output = self.getSystemStream("out")
    self.registerDefaultHandler(self.handle_msg)

  def handle_msg(self, envelope, collector, coordinator):
    collector.send(OutgoingMessageEnvelope(self.output, envelope.message))

  #Delete this method if not needed
  def window(self, collector, coordinator):
    pass

  #Delete this method if not needed
  def close(self):
    pass
