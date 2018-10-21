using System;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web.DynamicData;
using System.Web.Services;

public partial class _Default : System.Web.UI.Page {
    protected void Page_Load(object sender, EventArgs e) {
    }

    protected String getAllCategories(int reactionType) {
        
        var cats = String.Join("', '", ChemContext.db().getAllCategories(reactionType));
        return cats;
    }

    
    public static String getAllReactions(int reactionType, int catId)
    {
        var reacts = String.Join("', '", ChemContext.db().getReactions(reactionType, catId));
        return reacts;
    }

    [WebMethod]
    public static String getAllReactionsStr(int reactionType, int catId)
    {
        var reacts = String.Join(",", ChemContext.db().getReactions(reactionType, catId));
        return reacts;
    }


}
