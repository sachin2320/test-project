<%@ Application Language="C#" %>
<%@ Import Namespace="System" %>
<%@ Import Namespace="System.Web" %>

<script runat="server">
protected void Application_PreSendRequestHeaders(Object sender, EventArgs e)
{
    HttpApplication application = (HttpApplication)sender;
    if (HttpRuntime.UsingIntegratedPipeline)
    {
        application.Response.Headers.Remove("Server");
		Response.Headers.Remove("Server");
		Response.Headers.Remove("X-AspNet-Version");
                Response.Headers.Remove("X-AspNetMvc-Version");
    }
}
</script>