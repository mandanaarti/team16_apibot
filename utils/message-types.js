'use strict';

class Text {
  constructor(text, ratingType = null) {
    this.type = 'TEXT';
    this.text = text;
    if (ratingType !== null) this.rating_type = ratingType;
  }
}

class Image {
  constructor(url, mime) {
    this.type = 'IMAGE';
    this.url = url;
    this.mime = mime;
  }
}

class ImageId {
  constructor(id, text, mime) {
    this.type = 'IMAGE_ID';
    this.id = id;
    this.text = text;
    this.mime = mime;
  }
}

class Document {
  constructor(url, text, size, ratingType = null, readOnly = null) {
    this.type = 'DOCUMENT';
    this.url = url;
    this.text = text;
    this.size = size;
    if (ratingType !== null) this.rating_type = ratingType;
    if (readOnly !== null) this.read_only = readOnly;
  }
}

class DocumentId {
  constructor(id, text, size) {
    this.type = 'DOCUMENT_ID';
    this.id = id;
    this.text = text;
    this.size = size;
  }
}

class Video {
  constructor(url, text, ratingType = null) {
    this.type = 'VIDEO';
    this.url = url;
    this.text = text;
    if (ratingType !== null) this.rating_type = ratingType;
  }
}
class Audio {
  constructor(url, title, body, ratingType = null) {
    this.type = 'AUDIO';
    this.url = url;
    this.title = title;
    this.body = body;
    if (ratingType !== null) this.rating_type = ratingType;
  }
}
class AudioId {
  constructor(id, title, body) {
    this.type = 'AUDIO_ID';
    this.id = id;
    this.title = title;
    this.body = body;
  }
}
class VideoId {
  constructor(id, text) {
    this.type = 'VIDEO_ID';
    this.id = id;
    this.text = text;
  }
}

class ImageText {
  constructor(url, text, mime, ratingType = null) {
    this.type = 'IMAGE_TEXT';
    this.url = url;
    this.text = text;
    this.mime = mime;
    if (ratingType !== null) this.rating_type = ratingType;
  }
}

class VoiceNote {
  constructor(url) {
    this.type = 'VOICE_NOTE';
    this.url = url;
  }
}

class Delay {
  constructor(delay) {
    this.type = 'DELAY';
    this.delay = delay;
  }
}

class Contacts {
  constructor(contacts) {
    this.type = 'CONTACTS';
    this.contacts = contacts;
  }
}

class Button {
  constructor(body, buttons, allowCustomResponse = null, ttl = null, ratingType = null) {
    this.type = 'BUTTON';
    this.body = body;
    this.buttons = buttons;
    if (allowCustomResponse !== null) this.allow_custom_response = allowCustomResponse;
    if (ttl !== null) this.ttl = ttl;
    if (ratingType !== null) this.rating_type = ratingType;
  }
}

class Action {
  constructor(body, actions, ratingType = null) {
    this.type = 'ACTION';
    this.body = body;
    this.actions = actions;
    if (ratingType !== null) this.rating_type = ratingType;
  }
}

class Card {
  constructor(card, ratingType = null) {
    this.type = 'CARD';
    this.card = card;
    if (ratingType !== null) this.rating_type = ratingType;
  }
}

class RichInput {
  constructor(richInput) {
    this.type = 'RICH_INPUT';
    this.richInput = richInput;
  }
}

class Article {
  constructor(article, ratingType = null) {
    this.type = 'ARTICLE';
    this.article = article;
    if (ratingType !== null) this.rating_type = ratingType;
  }
}

class Template {
  constructor(template) {
    this.type = 'TEMPLATE';
    this.template = template;
  }
}
class MultiSelectButton {
  constructor(multiSelectButton, ratingType = null) {
    this.type = 'MULTISELECTBUTTON';
    this.multiSelectButton = multiSelectButton;
    if (ratingType !== null) this.rating_type = ratingType;
  }
}
class Location {
  constructor(location, ratingType = null) {
    this.type = 'LOCATION';
    this.location = location;
    if (ratingType !== null) this.rating_type = ratingType;
  }
}

class ScoreCard {
  constructor(scoreCard, shareText) {
    this.type = 'SCORECARD';
    this.scorecard = scoreCard;
    this.scorecard.share_message = shareText;
  }
}

class CatalogList {
  constructor(body, catalogs) {
    this.type = 'CATALOGLIST';
    this.body = body;
    this.catalogs = catalogs;
  }
}

class ProductList {
  constructor(products) {
    this.type = 'PRODUCTLIST';
    this.product_list = products;
  }
}

class VideoStream {
  constructor(streamPayload, title, ratingType = null) {
    this.type = 'VIDEOSTREAM';
    this.stream_payload = streamPayload;
    this.title = title;
    if (ratingType !== null) this.rating_type = ratingType;
  }
}

module.exports = {
  Text,
  Image,
  ImageText,
  VoiceNote,
  Delay,
  Document,
  Video,
  Audio,
  Contacts,
  Button,
  Action,
  Location,
  MultiSelectButton,
  Card,
  Article,
  Template,
  ImageId,
  VideoId,
  DocumentId,
  AudioId,
  RichInput,
  ScoreCard,
  CatalogList,
  ProductList,
  VideoStream,
};
