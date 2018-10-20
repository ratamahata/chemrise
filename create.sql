CREATE TABLE [dbo].[ReactionTypes]
(
	[Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
    [defaultName] NVARCHAR(80) NULL
)

CREATE TABLE [dbo].[Categories] (
    [Id]   INT           IDENTITY (1, 1) NOT NULL,
	[reactionTypeId] INT NOT NULL,
    [defaultName] NVARCHAR (80) NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
	CONSTRAINT [FK_Categories_ToReactionTypes] FOREIGN KEY ([reactionTypeId]) REFERENCES [dbo].[ReactionTypes] ([Id])
);

CREATE TABLE [dbo].[Languages] (
    [Id] INT IDENTITY (1, 1) NOT NULL,
    [Name] NVARCHAR (40) NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

CREATE TABLE [dbo].[CategoryNames] 
(
	[Id] INT IDENTITY (1, 1) NOT NULL PRIMARY KEY,
    [categoryId] INT NOT NULL,
	[languageId] INT NOT NULL,	
	[name] NVARCHAR(80) NOT NULL, 
    CONSTRAINT [FK_CategoryNames_ToReactionCategories] FOREIGN KEY ([categoryId]) REFERENCES [Categories]([Id]),
    CONSTRAINT [FK_CategoryNames_ToLanguages] FOREIGN KEY ([languageId]) REFERENCES [Languages]([Id])	
)

CREATE TABLE [dbo].[Reactions] (
    [Id]           INT          IDENTITY (1, 1) NOT NULL,
	[reactionTypeId] INT NOT NULL,
    [reagents]     VARCHAR (40) NOT NULL,
    [products]     VARCHAR (40) NOT NULL,
    [fakeProducts] VARCHAR (80) NULL,
    [conditions]   VARCHAR (40) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
	CONSTRAINT [FK_Reactions_ToReactionTypes] FOREIGN KEY ([reactionTypeId]) REFERENCES [dbo].[ReactionTypes] ([Id])
);

CREATE TABLE [dbo].[ReactionCategories]
(	
    id INT IDENTITY (1, 1) NOT NULL,
	[categoryId] INT NOT NULL,
    [reactionId] INT NOT NULL, 
    CONSTRAINT [PK_ReactionCategories] PRIMARY KEY ([categoryId], [reactionId]),
	UNIQUE ([id]),
	CONSTRAINT [FK_ReactionCategories_ToReactions] FOREIGN KEY ([reactionId]) REFERENCES [dbo].[Reactions] ([Id]),
	CONSTRAINT [FK_ReactionCategories_ToCategories] FOREIGN KEY ([categoryId]) REFERENCES [dbo].[Categories] ([Id])
)
CREATE TABLE [dbo].[ReactionComments] (
    [Id] INT IDENTITY (1, 1) NOT NULL,
	[reactionId] INT             NOT NULL,
    [languageId] INT             NOT NULL,
    [conditions] NVARCHAR (1000) NULL,
    [description] NVARCHAR(4000) NULL, 
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_ReactionComments_ToLanguages] FOREIGN KEY ([languageId]) REFERENCES [dbo].[Languages] ([Id]),
	CONSTRAINT [FK_ReactionComments_ToReactions] FOREIGN KEY ([reactionId]) REFERENCES [dbo].[Reactions] ([Id])
);

CREATE TABLE [dbo].[ReactionTypeNames] 
(
	[Id] INT IDENTITY (1, 1) NOT NULL PRIMARY KEY,
    [reactionTypeId] INT NOT NULL,
	[languageId] INT NOT NULL,	
	[name] NVARCHAR(80) NOT NULL, 
    CONSTRAINT [FK_ReactionTypeNames_ToReactionCategories] FOREIGN KEY ([reactionTypeId]) REFERENCES [ReactionTypes]([Id]),
    CONSTRAINT [FK_ReactionTypeNames_ToLanguages] FOREIGN KEY ([languageId]) REFERENCES [Languages]([Id])	
)
