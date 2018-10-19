CREATE TABLE [dbo].[Category]
(
	[Id] INT NOT NULL PRIMARY KEY
);
CREATE TABLE [dbo].[Languages] (
    [Id]   INT           NOT NULL,
    [Name] NVARCHAR (40) NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);
CREATE TABLE [dbo].[CategoryNames] 
(
	[Id] INT NOT NULL PRIMARY KEY,
    [categoryId] INT NOT NULL,
	[languageId] INT NOT NULL,	
	[name] NVARCHAR(80) NOT NULL, 
    CONSTRAINT [FK_CategoryNames_ToReactionCategories] FOREIGN KEY ([categoryId]) REFERENCES [Categories]([Id]),
    CONSTRAINT [FK_CategoryNames_ToLanguages] FOREIGN KEY ([languageId]) REFERENCES [Languages]([Id])	
)
CREATE TABLE [dbo].[ReactionCategories]
(	
    id INT NOT NULL,
	[categoryId] INT NOT NULL,
    [reactionId] INT NOT NULL, 
    CONSTRAINT [PK_ReactionCategories] PRIMARY KEY ([categoryId], [reactionId]),
	UNIQUE ([id]),
	CONSTRAINT [FK_ReactionCategories_ToReactions] FOREIGN KEY ([reactionId]) REFERENCES [dbo].[Reactions] ([Id]),
	CONSTRAINT [FK_ReactionCategories_ToCategories] FOREIGN KEY ([categoryId]) REFERENCES [dbo].[Categories] ([Id])
)
CREATE TABLE [dbo].[ReactionComments] (
    [Id]         INT             NOT NULL,
	[reactionId] INT             NOT NULL,
    [languageId] INT             NOT NULL,
    [conditions] NVARCHAR (1000) NULL,
    [description] NVARCHAR(4000) NULL, 
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_ReactionComments_ToLanguages] FOREIGN KEY ([languageId]) REFERENCES [dbo].[Languages] ([Id]),
	CONSTRAINT [FK_ReactionComments_ToReactions] FOREIGN KEY ([reactionId]) REFERENCES [dbo].[Reactions] ([Id])
);
CREATE TABLE [dbo].[Reactions] (
    [Id]           INT          NOT NULL,
    [reagents]     VARCHAR (40) NOT NULL,
    [products]     VARCHAR (40) NOT NULL,
    [fakeProducts] VARCHAR (80) NULL,
    [conditions] VARCHAR(40) NULL, 
    PRIMARY KEY CLUSTERED ([Id] ASC)
);





























CREATE TABLE [dbo].[Category]
(
	[Id] INT NOT NULL , 
    [categoryId] INT NOT NULL, 
	[languageId] INT NOT NULL, 
    [Name] VARCHAR(200) NOT NULL,	
    CONSTRAINT [FK_Category_ToLanguages] FOREIGN KEY ([languageId]) REFERENCES [dbo].[Languages] ([Id]), 	
    PRIMARY KEY ([categoryId], [languageId]),
)

CREATE TABLE [dbo].[Languages]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [Name] NVARCHAR(40) NOT NULL
)

CREATE TABLE [dbo].[ReactionCategories]
(
	[Id] INT NOT NULL PRIMARY KEY
)

CREATE TABLE [dbo].[ReactionCategoryNames] 
(
	[Id] INT NOT NULL PRIMARY KEY,
    [categoryId] INT NOT NULL,
	[languageId] INT NOT NULL,	
	[name] NVARCHAR(80) NOT NULL, 
    CONSTRAINT [FK_ReactionCategoryNames_ToReactionCategories] FOREIGN KEY ([categoryId]) REFERENCES [ReactionCategories]([Id]),
    CONSTRAINT [FK_ReactionCategoryNames_ToLanguages] FOREIGN KEY ([languageId]) REFERENCES [Languages]([Id])	
)

CREATE TABLE [dbo].[Reactions] (
    [Id]           INT          NOT NULL,
    [reagents]     VARCHAR (40) NOT NULL,
    [products]     VARCHAR (40) NOT NULL,
    [fakeProducts] VARCHAR (80) NULL,
    [conditions] VARCHAR(40) NULL, 
    PRIMARY KEY CLUSTERED ([Id] ASC)
);


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


