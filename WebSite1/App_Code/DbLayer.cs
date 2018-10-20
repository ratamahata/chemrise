using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for DbLayer
/// </summary>
public class DbLayer {

    static private chemdbEntities chemContext = new chemdbEntities();
    public DbLayer()
    {
    }

    private String allCategoriesCsv;
    public String getAllCategoriesCsv(int typeId)
    {
        if (allCategoriesCsv == null)
        {
            allCategoriesCsv = String.Join("', '", chemContext.Categories.Select(c => c.defaultName));
        }
        return allCategoriesCsv;
    }


}