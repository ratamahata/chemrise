using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Context
/// </summary>
public class ChemContext
{
    private ChemContext() {
        
    }

    static private ChemContext context = new ChemContext();
    
    static private DbLayer dbLayer = new DbLayer();

    static public ChemContext instance() {
        return context;
    }

    public static DbLayer db() {
        return dbLayer;
    }

}