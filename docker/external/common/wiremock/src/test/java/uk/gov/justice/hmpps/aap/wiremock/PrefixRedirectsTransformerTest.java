package uk.gov.justice.hmpps.aap.wiremock;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PrefixRedirectsTransformerTest {
  private final PrefixRedirectsTransformer transformer = new PrefixRedirectsTransformer();

  @Test
  void shouldRewriteRootRelativeLocations() {
    // Arrange
    String locationHeader = "/sign-in";

    // Act
    String rewrittenLocation = transformer.rewriteLocation(
      locationHeader,
      "/hmpps-arns-assessment-platform-ui",
      "http://aap-ui:3000"
    );

    // Assert
    assertEquals("/hmpps-arns-assessment-platform-ui/sign-in", rewrittenLocation);
  }

  @Test
  void shouldRewriteAbsoluteLocationsFromTheProxyTarget() {
    // Arrange
    String locationHeader = "http://aap-ui:3000/sign-in/hmpps-auth/callback?code=test#done";

    // Act
    String rewrittenLocation = transformer.rewriteLocation(
      locationHeader,
      "/hmpps-arns-assessment-platform-ui",
      "http://aap-ui:3000"
    );

    // Assert
    assertEquals(
      "/hmpps-arns-assessment-platform-ui/sign-in/hmpps-auth/callback?code=test#done",
      rewrittenLocation
    );
  }

  @Test
  void shouldLeaveUnrelatedAbsoluteLocationsUntouched() {
    // Arrange
    String locationHeader = "http://hmpps-auth:9090/auth/sign-in";

    // Act
    String rewrittenLocation = transformer.rewriteLocation(
      locationHeader,
      "/hmpps-arns-assessment-platform-ui",
      "http://aap-ui:3000"
    );

    // Assert
    assertEquals("http://hmpps-auth:9090/auth/sign-in", rewrittenLocation);
  }

  @Test
  void shouldNotDoublePrefixLocationsThatAreAlreadyRewritten() {
    // Arrange
    String locationHeader = "/hmpps-arns-assessment-platform-ui/sign-in";

    // Act
    String rewrittenLocation = transformer.rewriteLocation(
      locationHeader,
      "/hmpps-arns-assessment-platform-ui",
      "http://aap-ui:3000"
    );

    // Assert
    assertEquals("/hmpps-arns-assessment-platform-ui/sign-in", rewrittenLocation);
  }
}
