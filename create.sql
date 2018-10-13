CREATE TABLE [dbo].[Languages]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [Name] NVARCHAR(40) NOT NULL
)

CREATE TABLE [dbo].[ReactionCategories]
(
	[Id] INT NOT NULL PRIMARY KEY
)

CREATE TABLE [dbo].[ReactionCategoryNames] {
	[Id] INT NOT NULL PRIMARY KEY,
    [categoryId] INT NOT NULL,
	[languageId] INT NOT NULL,
	[Name] NVARCHAR[80] NOT NULL,
	CONSTRAINT [FK_ReactionCategoryNames_ToReactionCategories] FOREIGN KEY ([categoryId]) REFERENCES [ReactionCategories]([Id]),
    CONSTRAINT [FK_ReactionCategoryNames_ToLanguages] FOREIGN KEY ([languageId]) REFERENCES [Languagess]([Id])	
}

CREATE TABLE [dbo].[Reactions]
(
	[Id] INT NOT NULL PRIMARY KEY,
	[categoryId] INT NOT NULL,    
    [reagents] VARCHAR(40) NOT NULL, 
    [products] VARCHAR(40) NOT NULL, 
    [fakeProducts] VARCHAR(80) NULL,
	CONSTRAINT [FK_Reactions_ToReactionCategories] FOREIGN KEY ([categoryId]) REFERENCES [ReactionCategories]([Id])
)

CREATE TABLE [dbo].[ReactionComments]
(
	[Id] INT NOT NULL PRIMARY KEY,
	[reactionId] INT NOT NULL,    	
	[languageId] INT NOT NULL,    
    [conditions] NVARCHAR(1000) NULL, 
	[explanation] NVARCHAR(4000) NULL, 
	CONSTRAINT [FK_ReactionComments_ToReactions] FOREIGN KEY ([reactionId]) REFERENCES [Reactions]([Id])	
    CONSTRAINT [FK_ReactionComments_ToLanguages] FOREIGN KEY ([languageId]) REFERENCES [Languagess]([Id])
)


