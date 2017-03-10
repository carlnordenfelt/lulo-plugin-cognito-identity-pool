# lulo Cognito Identity Pool

lulo Cognito Identity Pool creates Identify Pools for Amazon Cognito.

lulo Cognito Identity Pool is a [lulo](https://github.com/carlnordenfelt/lulo) plugin

# Installation
```
npm install lulo-plugin-cognito-identity-pool --save
```

## Usage
### Properties
* IdentityPoolName: Name of the identity pool. Required.
* AllowUnauthenticatedIdentities: boolean indicating if the pool allows unauthenticated access or not. Required.
* For further properties, see the [AWS SDK Documentation for CognitoIdentity::createIdentityPool](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#createIdentityPool-property)

### Return Values

#### Ref
When the logical ID of this resource is provided to the Ref intrinsic function, Ref returns the **Identity Pool Id**.

`{ "Ref": "IdentityPool" }`

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
