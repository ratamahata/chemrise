<%@ Page Language="C#" MasterPageFile="~/Site.master" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<asp:Content ID="headContent" ContentPlaceHolderID="head" Runat="Server">
</asp:Content>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    

<a href="/admin.aspx/">Админка</a><br/><br/>


<table style="border: solid 2px red;" border="1" cellspacing="0" cellpadding="8">
<tbody>
<tr>
<td colspan="4">Составляем ОВР по неорганической химии для подготовки к ЕГЭ</td>
</tr>
<tr>
<td rowspan="2">
	<div class="category">Все реакции</div>
</td>
<td rowspan="2">
	<div class="reaction">Реакция №1</div>
</td>
<td colspan="2" id="reactionPane">
</td>
</tr>
<tr>
<td>
	<div class="product">H<sub>2</sub>O</div>
</td>
<td> 
	<button onclick="checkProducts()" class="checkButton" style="display:none">проверить</button>
	<div id="descriptionPane">&nbsp;</div>
</td>
</tr>
</tbody>
</table>


</asp:Content>


