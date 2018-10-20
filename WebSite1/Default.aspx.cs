using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web.DynamicData;

public partial class _Default : System.Web.UI.Page {
    protected void Page_Load(object sender, EventArgs e) {
    }

    protected String getAllCategories(int reactionType) {
        chemdbEntities context = new chemdbEntities();
        var cats = String.Join(
            "', '",
            context.Categories.Select(c => c.defaultName));
        return cats;
    }

}
