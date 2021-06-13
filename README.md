# Serverless Fullstack Web App

React JS + AWS Amplify with GraphQl pagination - Auth, API, Storage.

## Clone the repo

Delete the amplify folder and the aws-exports.js file.

If you never have worked with AWS Amplify.

https://docs.amplify.aws/

After AWS Amplify configuration:

`amplify init`

Enter a name for the project bareauthstyled<br />
? Enter a name for the environment dev<br />
? Choose your default editor: Visual Studio Code<br />
? Choose the type of app that you're building javascript<br />
Please tell us about your project<br />
? What javascript framework are you using react<br />
? Source Directory Path: src<br />
? Distribution Directory Path: build<br />
? Build Command: npm run-script build<br />
? Start Command: npm run-script start<br />
...
? Do you want to use an AWS profile? Yes<br />
? Please choose the profile you want to use: default

`amplify add auth`

Do you want to use the default authentication and security configur
ation? Default configuration<br />
Warning: you will not be able to edit these selections.<br />
How do you want users to be able to sign in? Username<br />
Do you want to configure advanced settings? No, I am done.

`amplify add api`

Please select from one of the below mentioned services: GraphQL<br />
? Provide API name: flowpostsapi<br />
? Choose the default authorization type for the API API key<br />
? Enter a description for the API key: public<br />
? After how many days from now the API key should expire (1-365): 365<br />
? Do you want to configure advanced settings for the GraphQL API Yes, I want to make some additional changes.<br />
? Configure additional auth types? Yes<br />
? Choose the additional authorization types you want to configure for the API Amazon Cognito User Pool<br />
Cognito UserPool configuration<br />
Use a Cognito user pool configured as a part of this project.<br />
? Enable conflict detection? No<br />
? Do you have an annotated GraphQL schema? No<br />
? Choose a schema template: Single object with fields (e.g., “Todo” with ID, name, description)<br />
Do you want to edit the schema now? Yes<br />
<br />
Copy and paste Schema<br />
<br />
type Post<br />
@model<br />
@auth(<br />
rules: [<br />
{ allow: owner, ownerField: "owner" }<br />
{ allow: public, operations: [read] }<br />
{ allow: private, operations: [read] }<br />
]<br />
) {<br />
id: ID!<br />
owner: String<br />
relation: String<br />
title: String!<br />
text: String!<br />
media: String!<br />
createdAt: String<br />
updatedAt: String<br />
}<br />

`amplify add storage`

? Please select from one of the below mentioned services: Content (Images, audio
, video, etc.)<br />
? Please provide a friendly name for your resource that will be used to label th
is category in the project: flowposts<br />
? Please provide bucket name: flowpostsdcde08605dc84af99efbbea229940b36<br />
? Who should have access: Auth and guest users<br />
? What kind of access do you want for Authenticated users? create/update, read,
delete<br />
? What kind of access do you want for Guest users? read<br />
? Do you want to add a Lambda Trigger for your S3 Bucket? No<br />

`amplify push`

<br />
Category | Resource name     | Operation | Provider plugin   |<br />
| -------- | ----------------- | --------- | ----------------- |<br />
| Auth     | flowposts07da9e87 | Create    | awscloudformation |<br />
| Api      | flowpostsapi      | Create    | awscloudformation |<br />
? Are you sure you want to continue? Yes<br />

GraphQL schema compiled successfully.<br />

? Do you want to generate code for your newly created GraphQL API Yes<br />
? Choose the code generation language target typescript<br />
? Enter the file name pattern of graphql queries, mutations and subscriptions src graphql/\*_/_.ts<br />
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscriptions Yes<br />
? Enter maximum statement depth [increase from default if your schema is deeply nested] 2<br />

? Enter the file name for the generated code src/API.ts<br />

`yarn install`

Happy hacking :)
