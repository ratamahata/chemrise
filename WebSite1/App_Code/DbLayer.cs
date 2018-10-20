using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for DbLayer
/// </summary>
public class DbLayer {

    static private chemdbEntities chemContext = new chemdbEntities();
    NameValueCollection cache = new NameValueCollection();

    public DbLayer()
    {
    }

    public String getAllCategoriesCsv(int typeId)
    {
        String key = "allCats" + typeId;
        String value;
        if ((value = cache[key]) == null)
        {
            value = cache[key] = String.Join("', '", chemContext.Categories
                .Where(c => c.reactionTypeId == typeId)
                .Select(c => c.defaultName));
        }
        return value;
    }




}