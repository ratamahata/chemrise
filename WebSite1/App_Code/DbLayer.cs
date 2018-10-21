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
    static private Regex elRegex = new Regex("[A-Z]([a-z]+)?");
    IDictionary<string, object> cache = new Dictionary<string, object>();

    public DbLayer()
    {
    }

    private static Random rng = new Random();
    public static void Shuffle(IList list)
    {
        int n = list.Count;
        while (n > 1)
        {
            n--;
            int k = rng.Next(n + 1);
            object value = list[k];
            list[k] = list[n];
            list[n] = value;
        }
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

    private List<string> getAllCompounds(int typeId)
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
                .Where(c => c.reactionTypeId == typeId && c.reagents.StartsWith("S"))
                .Select(r => getReactionString(r))));
        }
        return (string)value;

    }

    private String getReactionString(Reaction r)
    {
        List<String> fakeProducts;
        if (!string.IsNullOrEmpty(r.fakeProducts))
        {
            fakeProducts = r.fakeProducts.Replace(" ", "").Replace('-', '+').Split('+').ToList();
        } else
        {
            fakeProducts = new List<string>();
            foreach (String c in getAllCompounds(r.reactionTypeId))
            {
                bool containsAll = true;
                foreach(var match in elRegex.Matches(c))
                {
                    if (!r.reagents.Contains(match.ToString()))
                    {
                        containsAll = false;
                        break;                        
                    }                        
                }
                if (containsAll)
                {
                    fakeProducts.Add(c);
                }
            }            
        }
        List<String> allProducts = r.products.Replace(" ", "").Replace('-', '+').Split('+').ToList();
        allProducts.AddRange(fakeProducts);
        Shuffle(allProducts);

        StringBuilder sb = new StringBuilder(r.reagents).Append(" -> ");
        bool first = true;
        foreach(String p in allProducts)
        {
            if (first)
            {
                first = false;
            } else
            {
                sb.Append(" + ");
            }
            sb.Append(p);
        }
        return sb.ToString();
    }

}