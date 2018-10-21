using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

/// <summary>
/// Summary description for DbLayer
/// </summary>
public class DbLayer {

    static private chemdbEntities chemContext = new chemdbEntities();
    
    IDictionary<string, object> cache = new Dictionary<string, object>();

    public DbLayer()
    {
    }

    public string getAllCategories(int typeId)
    {
        string key = "allCats" + typeId;
        object value = null;
        cache.TryGetValue(key, out value);
        if (value  == null)
        {
            value = (string)(cache[key] = string.Join("','", chemContext.Categories
                .Where(c => c.reactionTypeId == typeId)
                .Select(c => c.defaultName)));
        }
        return (string)value;
    }


    public string getReactions(int typeId, int categoryId)
    {
        string key = "reactions" + typeId + "_" + categoryId;
        object value = null;
        cache.TryGetValue(key, out value);
        if (value == null)
        {
            string catFilter = chemContext.Categories.Single(e => e.Id == categoryId + 1).regex;
            value = (string)(cache[key] = string.Join("','", chemContext.Reactions
                .ToList()
                .Where(c => c.reactionTypeId == typeId && Regex.IsMatch(c.reagents, catFilter))
                .Select(r => DBHelper.getReactionString(r, this))));
        }
        return (string)value;
    }

    public List<string> getAllCompounds(int typeId)
    {
        string key = "allCompounds" + typeId;
        object value;
        cache.TryGetValue(key, out value);
        if (value == null)
        {
            value = (List<string>)(cache[key] = string.Join("'+'", chemContext.Reactions
                .Where(c => c.reactionTypeId == typeId)
                .Select(
                    c => (c.reagents + "+" + c.products
                        + ((c.fakeProducts == null) ? "" : ("+" + c.fakeProducts.Replace("-", "+")))).Replace(" ", ""))).Split('+')
                        .Distinct().ToList());
        }
        return (List<string>)value;
    }




}