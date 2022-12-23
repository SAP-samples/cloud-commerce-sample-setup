### Folder Structure

- lib folder: An optional folder where you can add pre-compiled extensions.  The JAR files and Java libraries that support the pre-compiled extensions should reside in this folder. If you have extensions with dependencies, put the source extension in this folder. The dependent extension goes in the corresponding custom extension folder.
- trusted-certificates folder: A folder where you can add any trusted certificate for systems to communicate with Data Hub.
- logback.xml: The file that defines logging details.
- encryption-key.txt: The file that defines the encryption key to be used with Data Hub. For details of the encryption key and related to it configurations, refer to [Tutorial: Using Attribute Encryption](https://help.sap.com/docs/SAP_COMMERCE/d9ed2cef77db4db694891e3da3b5d224/455fe0a1361f41109c12eb008fe64006.html), but **note**, the key should be stored in this file in CCv2 deployments.
- datahub-environment.conf: The file that contains the properties shared by all environments in a basic Data Hub configuration.
- datahub-environment-[environment_code].conf: The file that contains unique properties that are assigned to specific environments.

### Expanded Information on Properties

Most folders & files are fairly self-explanatory. Environment properties tend to be the exception. Data Hub supports [Configuration Using HOCON](https://help.sap.com/docs/SAP_COMMERCE/d9ed2cef77db4db694891e3da3b5d224/25550740941d434b8c003347601af0ac.html).

Properties entered into the environment specific configuration files will overwrite existing properties OR append with new properties. This is useful for Data Hub secrets or performance adjustments.
