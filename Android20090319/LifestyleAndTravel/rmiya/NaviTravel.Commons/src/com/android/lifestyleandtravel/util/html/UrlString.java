package com.android.lifestyleandtravel.util.html;


import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import com.android.lifestyleandtravel.util.ArrayUtil;
import com.android.lifestyleandtravel.util.StringUtil;

public class UrlString {

	private final Map<String, UrlParameter> parameters = new LinkedHashMap<String, UrlParameter>();

	private String path;

	private String queryString;

	public void parse(final String url) {
		if (StringUtil.contains(url, '?')) {
			final int questionPos = url.indexOf('?');
			path = url.substring(0, questionPos);
			queryString = url.substring(questionPos + 1);
		} else {
			path = url;
		}
		final String[] params = StringUtil.split(queryString, "&");
		for (int i = 0; i < params.length; i++) {
			final String param = params[i];
			if (StringUtil.contains(param, '=')) {
				final String key = param.substring(0, param.indexOf('='));
				UrlParameter urlParameter = parameters.get(key);
				if (urlParameter == null) {
					urlParameter = new UrlParameter();
					urlParameter.setKey(key);
					parameters.put(urlParameter.getKey(), urlParameter);
				}
				urlParameter.addValue(param.substring(param.indexOf('=') + 1));
			}
		}
	}

	public String getPath() {
		return path;
	}

	public String getParameter(final String key) {
		final UrlParameter param = parameters.get(key);
		if (param == null) {
			return null;
		}
		return param.getValue();
	}

	public String[] getParameters(final String key) {
		final UrlParameter param = parameters.get(key);
		if (param == null) {
			return null;
		}
		return param.getValues();
	}

	public boolean isIdentical(final UrlString otherUrl) {
		if (!getPath().equals(otherUrl.getPath())) {
			return false;
		}
		final Set<String> myParamNames = getParameterNames();
		final Set<String> otherParamNames = otherUrl.getParameterNames();
		if (myParamNames.size() != otherParamNames.size()) {
			return false;
		}
		for (final Iterator<String> it = myParamNames.iterator(); it.hasNext();) {
			final String key = it.next();
			final String[] myValues = getParameters(key);
			final String[] otherValues = otherUrl.getParameters(key);
			if (!ArrayUtil.equalsIgnoreSequence(myValues, otherValues)) {
				return false;
			}
		}
		return true;
	}

	public Set<String> getParameterNames() {
		return Collections.unmodifiableSet(parameters.keySet());
	}
}
