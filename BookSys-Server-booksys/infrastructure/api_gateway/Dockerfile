FROM openjdk:8-jdk-alpine
EXPOSE 8001
ADD target/api_gateway-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]