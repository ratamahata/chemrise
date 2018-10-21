using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

/// <summary>
/// Static helper functions
/// </summary>
public static class DBHelper
{
    static private Regex elRegex = new Regex("[A-Z]([a-z]+)?");

    public static String getReactionString(Reaction r, DbLayer dbLayer)
    {
        List<String> allProducts = r.products.Replace(" ", "").Replace('-', '+').Split('+').ToList();
        List<String> fakeProducts;
        if (!string.IsNullOrEmpty(r.fakeProducts))
        {
            fakeProducts = r.fakeProducts.Replace(" ", "").Replace('-', '+').Split('+').ToList();
        }
        else
        {
            fakeProducts = new List<string>();
            String checkExistanceStr = "+" + (r.reagents + "+" + r.products).Replace(" ", "") + "+";
            foreach (String c in dbLayer.getAllCompounds(r.reactionTypeId))
            {
                if (!checkExistanceStr.Contains("+" + c + "+"))
                {
                    bool containsAll = true;
                    foreach (var match in elRegex.Matches(c))
                    {
                        String str = match.ToString();
                        if (!r.reagents.Contains(str))
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
        }
        
        allProducts.AddRange(fakeProducts);
        Shuffle(allProducts);

        StringBuilder sb = new StringBuilder(r.reagents).Append(" -> ");
        bool first = true;
        foreach (String p in allProducts)
        {
            if (first)
            {
                first = false;
            }
            else
            {
                sb.Append(" + ");
            }
            sb.Append(p);
        }
        return sb.ToString();
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


}