from com.quantiply.samza.task import BaseTask
from org.apache.samza.system import OutgoingMessageEnvelope

class <%= taskName %>(BaseTask):

  def _init(self, config, context, metric_adaptor):<%
_.forEach(outTopicNames, function(out) { %>
    self.<%- out.nickname %> = self.getSystemStream("<%- out.nickname %>")<%
});%><%
if (inTopicNames.length > 1) {
  _.forEach(inTopicNames, function(inName) {
%>
    self.registerHandler("<%- inName.nickname %>", self.<%- inName.processFunc %>)<%
  });
} else {
%>
    self.registerDefaultHandler(self.handleMsg)<%
} %>
<%
if (inTopicNames.length > 1) {
  _.forEach(inTopicNames, function(inName) { %>
  def <%- inName.processFunc %>(self, envelope, collector, coordinator):
    #Handle messages from <%- inName.topic %> topic
    pass
<%
  });
} else { %>
  def handleMsg(self, envelope, collector, coordinator):<%
  _.forEach(outTopicNames, function(out) { %>
    collector.send(OutgoingMessageEnvelope(self.<%- out.nickname %>, envelope.message))<%
  });
} %>

  #Delete this method if not needed
  def window(self, collector, coordinator):
    pass

  #Delete this method if not needed
  def close(self):
    pass
