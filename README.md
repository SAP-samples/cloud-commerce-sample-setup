# SAP Commerce Cloud with Data Hub Sample Repository

This sample repository contains the files and folders that are required to set up SAP Commerce Cloud with Data Hub.  This sample is meant to be an addition to a standard storefront setup and shows only how Data Hub deployment can be configured.  This sample can be used "as is" only, if you're interested in trying or testing the Data Hub. Most likely, for production deployments, it has to be combined with another sample demonstrating the commerce suite configuration and customization capabilities, e.g. 2205-spartacus.
You can clone this repository and then follow the instructions in the readme to update the example files with your specific details. 

When your files are ready, push them to your SAP Commerce Cloud repository.  

# Requirements

- You have a public-facing code repository.
- You have an active SAP Commerce Cloud subscription.
- You have a license for SAP Commerce 2205 or higher
- You have a license for Data Hub on Commerce Cloud version 2205 or higher.
- You have not set up SAP Commerce Cloud yet.

# Supported Versions

You can find the supported SAP Commerce versions listed in the [Compatibility help topic](https://help.sap.com/docs/SAP_COMMERCE_CLOUD_PUBLIC_CLOUD/20125f0eca6340dba918bda360e3cdfa/31ac209eb08f41bc92e9bbe5772fb949.html?version=v2205).

# Configuration

These instructions walk you through the process of cloning the repository and then updating the sample files with your specific requirements. 

The following folders and files are included in the sample repository.

Root level 
- core-customize folder: The folder that contains all the folders and files that support Commerce Cloud.
- datahub folder: The folder that contains all the folders and files that support Data Hub.

core-customize folder
- manifest.json: The Commerce Cloud manifest.json file, which defines how your code will be built and deployed in the Public Cloud environments. The manifest is set up to leverage [configuration reuse](https://help.sap.com/viewer/1be46286b36a4aa48205be5a96240672/SHIP/en-US/2311d89eef9344fc81ef168ac9668307.html) to better allow for consistency between local and cloud builds.
- hybris folder: contains a sample custom folder for storing any custom extensions as well as the config folder for storing local and cloud properties, localextensions.xml and any local solr/tomcat configurations
- other sample manifests: A collection of tested and verified manifest files that you can use as starting points for your Commerce Cloud environments.

datahub folder
- manifest.json: The Data Hub manifest.json file that defines the Data Hub application and extensions.
- ccv2 example folder: A generic folder that you can build out for custom extensions.
- config folder: The folder that contains the Data Hub configuration files and folders.
- README.md: Specific readme for Data Hub specific configuration.

### Clone Repository
Clone the sample repository ([instructions can be found here](https://help.github.com/articles/cloning-a-repository/)). The files are copied to your local machine.

### Update the Custom Extensions

1. List any extensions you're using (custom and any from Commerce runtime) in the core-customize/hybris/config/localextensions.xml file
2. If you have custom extensions with dependencies, list the source extension first, then the dependent extension. Extensions are built in the order in which they appear in your localextension.xml and manifest.json files

### Update the manifests

1. Open the manifest.json file inside the core-customize folder. 
2. Update the “version” with the version of SAP Commerce that you plan to use. Refer to the [Supported Releases](https://help.sap.com/docs/SAP_COMMERCE_CLOUD_PUBLIC_CLOUD/12be4ac419604b01aabb1adeb2c4c8a2/1c6c687ad0ed4964bb43d409818d23a2.html?version=v2205) or to [Patch Releases](https://help.sap.com/docs/SAP_COMMERCE_CLOUD_PUBLIC_CLOUD/75d4c3895cb346008545900bffe851ce/cba026d2b36c4ab18f89525df92cc815.html?version=v2205)for more information.
3. Open the manifest.json file inside the datahub folder.
4. Update the “version” with the version of SAP DataHub that you plan to use. Refer to the [Supported Releases](https://help.sap.com/docs/SAP_COMMERCE_CLOUD_PUBLIC_CLOUD/12be4ac419604b01aabb1adeb2c4c8a2/1c6c687ad0ed4964bb43d409818d23a2.html?version=v2205) or to [Patch Releases](https://help.sap.com/docs/SAP_COMMERCE_CLOUD_PUBLIC_CLOUD/75d4c3895cb346008545900bffe851ce/cba026d2b36c4ab18f89525df92cc815.html?version=v2205)for more information.
5. Save the changes in both files.

### Provide deployment passwords
Password values are replaced with the placeholders in the configuration files for security reasons. Make sure to update the placeholders with the real values you're going to use as follows.
1. Search for `<dh_admin_pwd>` occurrences in the project files and replace it with a password value to be used by your deployment for the DataHub admin user. Should be in
    -  datahub/config/datahub-environment.conf
    -  core-customize/manifest.json
2. Search for `<dh_developer_pwd>` occurrences in the project files and replace it with a password value to be used by your deployment for the DataHub developer user. Should be in
    - datahub/config/datahub-environment.conf
    - core-customize/manifest.json
3. Search for `<dh_read-only_pwd>` occurrences in the project files and replace it with a password value to be used by your deployment for the DataHub read-only user. Should be only in datahub/config/datahub-environment.conf
4. Search for `<dh_content-owner_pwd>` occurrences in the project files and replace it with a password value to be used by your deployment for the DataHub content owner user. Should be only in datahub/config/datahub-environment.conf
5. Search for `<datahub_pwd>` occurrences in the project files and replace it with a password value to be used by your deployment for the platform user for publishing data from DataHub into the platform. Should be in
    - datahub/config/datahub-environment.conf
    - core-customize/hybris/bin/custom/datahubtestsetup/resources/impex/essentialdata-datahubtestsetup.impex

### Prepare to Push the Sample Repository
 
1. In the sample repository, verify that you have the following files in the *core-customize* folder.
   - manifest.json:  This is the manifest.json for Commerce Cloud.
   - \<custom extension> folders (optional)
2. Verify that you have the following files in the *datahub* folder.
   - manifest.json: This is the manifest.json for Data Hub.
   - \<config> folder: This is the folder which contains configuration information specific to Data Hub (see [Data Hub](datahub/README.md) readme for details). 
   - \<custom extension> folders (optional)

### Push the Commerce Cloud Configuration to Code Repository

Push the core-customize & datahub folder from your local machine to the root level of your Commerce Cloud repository.  

### Access the Cloud Portal

Log in to the Cloud Portal and verify that your code repository is connected.

1. From a supported browser, log in to https://portal.commerce.ondemand.com. For more information, see [Accessing the Cloud Portal](https://help.sap.com/viewer/0c2050f6d31f49ddb6eba18509060ae5/SHIP/en-US/bc745004669445478d0c0505d77e096c.html).
2. Select *Repository* and verify that you are connected to the correct code repository.
3. Find the environments that were provisioned for your subscription.
3. Create a new build.
4. Deploy the build to the environment using the *Initialize Database* option.

You may also wish to see [this video](https://enable.cx.sap.com/playlist/dedicated/116161351/1_6tm85g61/1_df6ptanl) which provides a walkthrough of how to connect your repository, as well as [this video](https://enable.cx.sap.com/playlist/dedicated/116161351/1_6tm85g61/1_9ogbv7hz) which outlines how to build and deploy

### Final Steps - Validating an example DataHub

Use the Cloud Portal to create a build and then deploy the build to an environment. 

1. After the build is deployed, you can find the 'Datahub' endpoint in the *Environments* page of the Cloud Portal listed under *Public Endpoints*.
2. Click on the *Datahub* hyperlink to access the details page for endpoint.
3. Either add an IP Filter Set for your IP address OR change the Base Rule from 'Deny All' to 'Allow All' in order to receive traffic to this example DataHub server.
4. Save the changes.
5. Click on the URL listed next to the *Datahub* public endpoint. You should see the Tomcat home page.
6. In your browser's address, append the endpoint address with */datahub-webapp/v1/version* and reload the page
7. Provide the username and password for the DataHub admin user you have configured for this environment.
7. Verify that you see the version of the deployed DataHub.

# Limitations

The repository must be a public-facing repository.  You cannot use a private repository to host SAP Commerce Cloud configurations. 

# Known Issues

There are no known issues at this time.

# How to Obtain Support

This repository is provided "as-is"; no support is available.

Find more information about SAP Commerce Cloud Setup on our [help site](https://help.sap.com/docs/SAP_COMMERCE_CLOUD_PUBLIC_CLOUD?version=v2205).

# License
Copyright (c) 2022 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE file](https://github.com/SAP-samples/cloud-commerce-sample-setup/blob/main/LICENSES/Apache-2.0.txt).
