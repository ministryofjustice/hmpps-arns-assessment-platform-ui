package uk.gov.justice.hmpps.aap.wiremock;

import com.github.tomakehurst.wiremock.extension.Parameters;
import com.github.tomakehurst.wiremock.extension.ResponseTransformerV2;
import com.github.tomakehurst.wiremock.http.HttpHeader;
import com.github.tomakehurst.wiremock.http.HttpHeaders;
import com.github.tomakehurst.wiremock.http.Response;
import com.github.tomakehurst.wiremock.stubbing.ServeEvent;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.stream.Collectors;

public class PrefixRedirectsTransformer implements ResponseTransformerV2 {
  private static final String LOCATION_HEADER = "Location";
  private static final String PREFIX_TO_ADD_PARAMETER = "prefixToAdd";
  private static final String PROXY_BASE_URL_PARAMETER = "proxyBaseUrl";

  @Override
  public Response transform(Response response, ServeEvent serveEvent) {
    Parameters parameters = serveEvent.getTransformerParameters();
    String prefixToAdd = normalisePrefix(readRequiredParameter(parameters, PREFIX_TO_ADD_PARAMETER));
    String proxyBaseUrl = stripTrailingSlash(readRequiredParameter(parameters, PROXY_BASE_URL_PARAMETER));
    String locationHeader = response.getHeaders().getHeader(LOCATION_HEADER).firstValue();

    if (locationHeader == null || locationHeader.isBlank()) {
      return response;
    }

    String rewrittenLocation = rewriteLocation(locationHeader, prefixToAdd, proxyBaseUrl);

    if (rewrittenLocation.equals(locationHeader)) {
      return response;
    }

    HttpHeaders rewrittenHeaders = buildHeadersWithoutLocation(response.getHeaders(), rewrittenLocation);

    return Response.Builder.like(response)
      .but()
      .headers(rewrittenHeaders)
      .build();
  }

  @Override
  public String getName() {
    return "prefix-redirects";
  }

  String rewriteLocation(String locationHeader, String prefixToAdd, String proxyBaseUrl) {
    if (locationHeader.startsWith(prefixToAdd + "/") || locationHeader.equals(prefixToAdd)) {
      return locationHeader;
    }

    if (locationHeader.startsWith("/")) {
      return prefixToAdd + locationHeader;
    }

    try {
      URI locationUri = new URI(locationHeader);
      URI proxyBaseUri = new URI(proxyBaseUrl);

      if (!hasMatchingOrigin(locationUri, proxyBaseUri)) {
        return locationHeader;
      }

      String rewrittenPath = locationUri.getRawPath();

      if (rewrittenPath == null || rewrittenPath.isBlank()) {
        rewrittenPath = "/";
      }

      return prefixToAdd + rewrittenPath + buildSuffix(locationUri);
    } catch (URISyntaxException exception) {
      return locationHeader;
    }
  }

  private HttpHeaders buildHeadersWithoutLocation(HttpHeaders headers, String rewrittenLocation) {
    List<HttpHeader> rewrittenHeaders = headers.all().stream()
      .filter(header -> !header.keyEquals(LOCATION_HEADER))
      .collect(Collectors.toList());

    rewrittenHeaders.add(new HttpHeader(LOCATION_HEADER, rewrittenLocation));

    return new HttpHeaders(rewrittenHeaders);
  }

  private boolean hasMatchingOrigin(URI locationUri, URI proxyBaseUri) {
    if (!stringEquals(locationUri.getScheme(), proxyBaseUri.getScheme())) {
      return false;
    }

    if (!stringEquals(locationUri.getHost(), proxyBaseUri.getHost())) {
      return false;
    }

    return effectivePort(locationUri) == effectivePort(proxyBaseUri);
  }

  private int effectivePort(URI uri) {
    if (uri.getPort() != -1) {
      return uri.getPort();
    }

    if ("https".equalsIgnoreCase(uri.getScheme())) {
      return 443;
    }

    return 80;
  }

  private String buildSuffix(URI locationUri) {
    StringBuilder suffixBuilder = new StringBuilder();

    if (locationUri.getRawQuery() != null && !locationUri.getRawQuery().isBlank()) {
      suffixBuilder.append('?').append(locationUri.getRawQuery());
    }

    if (locationUri.getRawFragment() != null && !locationUri.getRawFragment().isBlank()) {
      suffixBuilder.append('#').append(locationUri.getRawFragment());
    }

    return suffixBuilder.toString();
  }

  private String readRequiredParameter(Parameters parameters, String parameterName) {
    String value = parameters.getString(parameterName);

    if (value == null || value.isBlank()) {
      throw new IllegalArgumentException("Missing transformer parameter: " + parameterName);
    }

    return value;
  }

  private String normalisePrefix(String prefixToAdd) {
    String trimmedPrefix = stripTrailingSlash(prefixToAdd);

    if (trimmedPrefix.startsWith("/")) {
      return trimmedPrefix;
    }

    return "/" + trimmedPrefix;
  }

  private String stripTrailingSlash(String value) {
    if (value.endsWith("/") && value.length() > 1) {
      return value.substring(0, value.length() - 1);
    }

    return value;
  }

  private boolean stringEquals(String left, String right) {
    if (left == null || right == null) {
      return false;
    }

    return left.equalsIgnoreCase(right);
  }
}
