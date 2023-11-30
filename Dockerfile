FROM maven:3.8.7-openjdk-18-slim AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
ENV SPRING_CONFIG_NAME=application
COPY --from=build /app/target/op2-0.0.1-SNAPSHOT.jar mtt.jar
EXPOSE 8080
EXPOSE 5173
ENTRYPOINT ["java","-jar","mtt.jar"]