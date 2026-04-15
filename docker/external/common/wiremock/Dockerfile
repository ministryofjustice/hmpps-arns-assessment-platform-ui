FROM maven:3.9.11-eclipse-temurin-17 AS extension-build

WORKDIR /build

COPY pom.xml pom.xml
COPY src src

RUN mvn --batch-mode test package

FROM wiremock/wiremock:3.13.2

COPY --from=extension-build /build/target/wiremock-prefix-redirects-1.0.0.jar /var/wiremock/extensions/
