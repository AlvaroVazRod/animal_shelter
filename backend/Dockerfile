# Etapa 1: build con Maven wrapper (multi-stage)
FROM eclipse-temurin:21-jdk-alpine as builder

WORKDIR /app

# Copiar solo lo necesario para resolver dependencias primero
COPY .mvn .mvn
COPY mvnw pom.xml ./

# Descarga dependencias primero (esto cachea mejor)
RUN ./mvnw dependency:go-offline

# Ahora copiar el resto del código
COPY src ./src

# Empaquetar sin ejecutar tests
RUN ./mvnw clean package -DskipTests

# Etapa 2: imagen final más ligera
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copiar el JAR generado
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

# Ejecutar el JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
