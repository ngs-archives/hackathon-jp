# -*- coding: utf-8 -*-
# catalog.urls


from werkzeug.routing import (
  Map, Rule, Submount,
  EndpointPrefix, RuleTemplate,
)
import catalog.views

def make_rules():
  return [
    EndpointPrefix('catalog/', [
      Rule('/', endpoint='index'),
    ]),
  ]

all_views = {
  'catalog/index': catalog.views.index,
}
