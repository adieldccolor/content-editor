<%@ Page Language="C#" AutoEventWireup="true" %>
<script runat="server">
protected void Page_Load(object sender, EventArgs e)
    {
    	Response.ContentType = "font/wofff2";
        Response.AddHeader("Access-Control-Allow-Origin", "*");
        Response.Flush();
        Response.WriteFile("MaterialIcons-Regular.woff2");
    }
</script>