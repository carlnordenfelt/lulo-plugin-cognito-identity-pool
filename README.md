# lulo Cognito Identity Pool

lulo Cognito Identity Pool creates Identify Pools for Amazon Cognito.

lulo Cognito Identity Pool is a [lulo](https://github.com/carlnordenfelt/lulo) plugin

# Installation
```
npm install lulo-plugin-cognito-identity-pool --save
```

## Usage
### Properties
* UserPoolId: Id of the User Pool. Required.
* ClientName: Name of the client. Required.
* For further properties, see the [AWS SDK Documentation for CognitoIdentity::createIdentityPool](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#createIdentityPool-property)

### Return Values

#### Ref
When the logical ID of this resource is provided to the Ref intrinsic function, Ref returns the **Client Id**.

`{ "Ref": "Client" }`

#### Fn::GetAtt

**ClientSecret** If a ClientSecret is generated you can get it via

`Fn::GetAtt["Client", "ClientSecret"]`

### Required IAM Permissions
The Custom Resource Lambda requires the following permissions for this plugin to work:
```
{
    "Effect": "Allow",
    "Action": [
        "cognito-identity:CreateIdentityPool",
        "cognito-identity:UpdateIdentityPool",
        "cognito-identity:DeleteIdentityPool"
    ],
    "Resource": "*"
}
```

## License
[The MIT License (MIT)](/LICENSE)

## Change Log
[Change Log](/CHANGELOG.md)
