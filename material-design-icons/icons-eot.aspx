<%@ Page Language="C#" AutoEventWireup="true" %>
<script runat="server">
protected void Page_Load(object sender, EventArgs e)
    {
    	Response.ContentType = "application/vnd.ms-fontobject";
        Response.AddHeader("Access-Control-Allow-Origin", "*");
        Response.Flush();
        Response.WriteFile("MaterialIcons-Regular.eot");
    }
</script>