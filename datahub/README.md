
# Configuration

datahub folder
- manifest.json: The Data Hub manifest.json file that defines the Data Hub application and extensions.
- ccv2-example folder: A generic folder that you can build out for custom extensions.
- config folder: The folder that contains the Data Hub configuration files and folders.
- README.md: Specific readme for Data Hub specific configuration.

config folder
- lib folder: An optional folder where you can add pre-compiled extensions.  The JAR files and Java libraries that support the pre-compiled extensions should reside in this folder. If you have extensions with dependencies, put the source extension in this folder. The dependent extension goes in the corresponding custom extension folder.
- logback.xml: The file that defines logging details.
- datahub-environment.conf: The file that contains the properties shared by all environments in a basic Data Hub configuration.
- datahub-environment-[environment_code].conf: The file that contains unique properties that are assigned to specific environments.

### Update the Custom Extensions

1. Update the ccv2 example folder that is used for custom extensions.
 - Change the generic folder name to the name of your custom extension. The folder name and extension name must match.
 - Add the extension configuration information to the folder.
2. Repeat these steps for each custom extension.
3. If you don’t have custom extensions, you can delete the <custom-extension> folder.
4. If you plan to use pre-compiled extensions, such as Marketplace extensions or java source libraries, add them to the repository.
  - Open the datahub/config/lib folder.
  - Add the JAR files and Java libraries that support the pre-compiled extension.
  - Open the pom.xml file of the custom extension and add a line in the dependency section for *systemPath* with the path to the lib folder. 
 5. List the extensions in the Data Hub manifest.json file. If you have custom extensions with dependencies, list the source extension first, then the dependent extension. Extensions are built in the order in which they appear in the manifest.

### Update the Data Hub manifest.json

1. Open the manifest.json file inside the datahub folder.  This is the Data Hub manifest.json. 
2. Update the “datahub_version” with the version of Data Hub that you plan to use. Refer to the Supported Versions section of this readme for more information.
3. Save the changes.

### Update the Data Hub Environment Configuration File

1. Open the config folder.
2. Find the datahub-environment.conf file.
3. Open the configuration file and replace the default user names and passwords with the values that support your environment.
4. Save the changes. 

### Add an Optional Environment Variable File for Environments that Require Unique Properties

1. Open the config folder.
2. Open the datahub-environment-[environment_code].conf file.
3. Add environment properties for each unique property that you want to apply to the environment.
4. Name the file datahub-environment[environment_code].conf.
 - To find the environment code for an environment, see the instructions in the [SAP Commerce Cloud help](https://help.sap.com/viewer/0fa6bcf4736c46f78c248512391eb467/SHIP/en-US/1f6dfab4981347db8ab221acaf37960f.html).
5. Create a separate datahub-environment-[environment_code].conf file for each environment that requires unique properties.
6. If you do not need unique environment variables, delete the datahub-environment[environment_code].conf file.

### Verify the logback.xml file

1. Open the config folder.
2. Verify that the logback.xml file is inside the config folder.
3. DO NOT overwrite the "appender name=STDOUT" section of the logback.xml file.  This section is required if you want to access Data Hub logs in Kibana.

### Add Optional Pre-complied Extensions

Pre-compiled extensions are extensions such as Marketplace extensions.  If needed, these extensions are added to the lib folder. 

1. Open the config folder.
2. Open the lib folder.
3. Add the JAR files and Java libraries that support the pre-compiled extensions. 
4. If you are not using pre-compiled extensions, delete the lib folder.

### Create the encryption key
### **Do NOT use the encryption key in this sample repository for productive use!**

1. Make sure that you have openSSL installed on your local machine.
2. Open a terminal window and run the following command to generate a 128-bit AES key.

```bash
$ openssl enc -aes-128-ecb -k secret -P -md sha1
```

3. Verify that you see a result that includes values for “salt” and “key”.
4. Copy the string that displays after “key=“.  Do not include “key=“.
5. Paste the string into a new text file.
6. Save the file with the name “encryption-key.txt”.
7. Move the file to the config folder.

### Add an SSL Certificate for Secure Communication between Data Hub and Third-Party Systems
### **Do NOT use the sample google certificate for productive use!**

1. Open the config folder.
2. Create a folder named “trusted-certificates”.
3. Copy your x509 certificate to the trusted-certificates folder.  
4. Verify that the file has a .cer extension and is in ASCII pem encoded format.