from com.quantiply.samza.task import BaseTask
from org.apache.samza.system import OutgoingMessageEnvelope

class <%= taskName %>(BaseTask):
  
  def _init(self, config, context, metric_adaptor):<% _.forEach(outTopicNames, function(out) { %>
    self.<%- out.nickname %> = self.getSystemStream("<%- out.nickname %>")<% }); %><% if (inTopicNames.length > 1) { %>
    self.doLoop()<% } else { %>
    self.registerDefaultHandler(self.handle_msg)

  def handle_msg(self, envelope, collector, coordinator):<% _.forEach(outTopicNames, function(out) { %>
    collector.send(OutgoingMessageEnvelope(self.<%- out.nickname %>, envelope.message))<% }); %>
<% } %>

  #Delete this method if not needed
  def window(self, collector, coordinator):
    pass

  #Delete this method if not needed
  def close(self):
    pass
