### Folder Structure

- lib folder: An optional folder where you can add pre-compiled extensions.  The JAR files and Java libraries that support the pre-compiled extensions should reside in this folder. If you have extensions with dependencies, put the source extension in this folder. The dependent extension goes in the corresponding custom extension folder.
- trusted-certificates folder: A folder where you can add any trusted certificate for systems to communicate with Data Hub.
- logback.xml: The file that defines logging details.
- encryption-key.txt: The file that defines the encryption key to be used with Data Hub.
- datahub-environment.conf: The file that contains the properties shared by all environments in a basic Data Hub configuration.
- datahub-environment-[environment_code].conf: The file that contains unique properties that are assigned to specific environments.

### Expanded Information on Properties

Most folders & files are fairly self explanatory. Environment properties tend to be the exception. Data Hub supports configuration using [HOCON](https://help.sap.com/viewer/50c996852b32456c96d3161a95544cdb/1905/en-US/25550740941d434b8c003347601af0ac.html).

Properties entered into the environment specific configuration files will overwrite existing properties OR append with new properties. This is useful for Data Hub secrets or performance adjustments.