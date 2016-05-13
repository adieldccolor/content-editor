<%@ Page Language="C#" AutoEventWireup="true" %>
<script runat="server">
protected void Page_Load(object sender, EventArgs e)
    {
    	Response.ContentType = "application/x-font-ttf";
        Response.AddHeader("Access-Control-Allow-Origin", "*");
        Response.Flush();
        Response.WriteFile("MaterialIcons-Regular.ttf");
    }
</script>