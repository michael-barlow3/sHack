FROM openjdk:11
COPY target/vas-redshift-0.0.1-SNAPSHOT-jar-with-dependencies.jar /app.jar
WORKDIR /
CMD ["java","-cp","app.jar", "gov.va.redshift.vas_redshift.App"]