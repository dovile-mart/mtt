# Maven build stage
FROM maven:3.8.7-openjdk-18-slim AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src src
RUN mvn clean package -DskipTests

#FROM openjdk:17-jdk-slim
#ENV SPRING_CONFIG_NAME=application
#COPY --from=build /target/op2-0.0.1-SNAPSHOT.jar mtt.jar
#EXPOSE 8080
#EXPOSE 5173
#ENTRYPOINT ["java","-jar","mtt.jar"]

#frontend build stage
FROM node:14.17 as frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
COPY frontend/public public
COPY frontend/src src
RUN npm install

# Build the React app
RUN npm build

# Backend Stage
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the backend JAR file
COPY --from=build app/target/mtt.jar ./app.jar
COPY --from=frontend /app/frontend/build ./src/main/resources/static
# Expose ports
EXPOSE 5173 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
