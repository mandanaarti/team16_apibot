
'use strict';

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { klusterConfig } = require('../config');
const {
  samplePngImages,
  sampleJpegImages,
  sampleGifImages,
  samplePdfDocuments,
  sampleDocxDocuments,
  sampleXlsxDocuments,
  sampleXlsDocuments,
  sampleCsvFiles,
  sampleMp4Videos,
  sample3gpVideos,
  sampleOggAudios,
  sampleMpegAudios,
  sampleYoutubeVideos,
  sampleIframeLinks,
  sampleCatalogListUuid,
  sampleM3u8Videos,
} = require('./sample-media');
const {
  ImageId,
  DocumentId,
  VideoId,
  Video,
  Audio,
  AudioId,
  Button,
  MultiSelectButton,
  Card,
  Article,
  RichInput,
  Contacts,
  ImageText,
  Text,
  Document,
  Action,
  Location,
  CatalogList,
  ProductList,
  VideoStream,
} = require('./message-types');
const {
  contacts,
  multiSelectButton,
  location,
  locationWithName,
  locationWithAddress,
  locationWithNameAndAddress,
  buttonsNoReply,
  buttonsIcon10,
  buttonsIcon25,
  buttonGrid3,
  buttonGrid2,
  buttonGrid1,
  buttons10,
  buttons25,
  buttonsClasses,
  multiSelectButtonImageIcons15,
  multiSelectButtonImageIcons10,
  multiSelectButtonCustomResponseTrue,
  multiSelectButtonCustomResponseFalse,
  multiSelectButtonTtl,
  sampleDescription,
  richInputDate,
  richInputDefaultDate,
  richInputMinDate,
  richInputMaxDate,
  richInputLocationCustom,
  richInputLocationAllowAddress,
  richInputLocationForbidAddress,
  richInputFacialRecognition,
} = require('./message-samples');

const getIdFromUrl = async (type, environment) => {
  const fileMappings = {
    upload_mp4_video: 'sampleMp4Video.mp4',
    upload_3gp_video: 'sample3gpVideo.3gp',
    upload_jpeg_image: 'sampleJpegImage.jpeg',
    upload_png_image: 'samplePngImage.png',
    upload_gif_image: 'sampleGifImage.gif',
    upload_docx_document: 'sampleDocxDocument.docx',
    upload_pdf_document: 'samplePdfDocument.pdf',
    upload_ogg_audio: 'sampleOggAudio.ogg',
    upload_mpeg_audio: 'sampleMpegAudio.mp3',
  };
  const extensionMappings = {
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    pdf: 'application/pdf',
    png: 'image/png',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    mp4: 'video/mp4',
    '3gp': 'video/3gpp',
    mp3: 'audio/mpeg',
    ogg: 'audio/ogg',
  };
  const mediaUrl = path.join(__dirname, fileMappings[type]);
  const extension = mediaUrl.split('.').pop();
  const contentType = extensionMappings[extension];
  const data = new FormData();
  data.append('type', `${contentType}`);
  data.append('file', fs.createReadStream(`${mediaUrl}`));
  const response = await axios({
    method: 'post',
    url: `${klusterConfig.apiUrl}/bots/${klusterConfig.botId}/media`,
    headers: {
      Authorization: `Bearer ${klusterConfig.apiToken}`,
      ...data.getHeaders(),
    },
    data,
  });
  return response.data.id;
};

const getCatalogfromId = async (catalogUuid, environment) => {
  let url;
  if (environment.includes('web')) {
    environment = environment.split('-')[1];
    url = `${klusterConfig.apiUrl}/web-bots/${klusterConfig.botId}/catalogs/${catalogUuid}`;
  } else {
    url = `${klusterConfig.apiUrl}/bots/${klusterConfig.botId}/catalogs/${catalogUuid}`;
  }
  const params = {
    method: 'get',
    url,
    headers: {
      Authorization: `Bearer ${klusterConfig.apiToken}`,
    },
  };
  const response = await axios(params);
  return response.data;
};

const getMessagePayload = async (type, environment) => {
  const mediaUuid = await getIdFromUrl(type, environment);
  switch (type) {
    case 'upload_mp4_video':
      return new VideoId(mediaUuid, 'Sample Text');
    case 'upload_3gp_video':
      return new VideoId(mediaUuid, 'Sample Text');
    case 'upload_jpeg_image':
      return new ImageId(mediaUuid, 'Sample Jpeg Image', 'image/jpeg');
    case 'upload_png_image':
      return new ImageId(mediaUuid, 'Sample Png Image', 'image/png');
    case 'upload_gif_image':
      return new ImageId(mediaUuid, 'Sample gif_image', 'image/gif');
    case 'upload_docx_document':
      return new DocumentId(mediaUuid, 'Sample Docx Document', null);
    case 'upload_pdf_document':
      return new DocumentId(mediaUuid, 'Sample Pdf Document', null);
    case 'upload_ogg_audio':
      return new AudioId(mediaUuid, 'Sample Ogg Audio', 'Sample Body');
    case 'upload_mpeg_audio':
      return new AudioId(mediaUuid, 'Sample Mpeg Audio', 'Sample Body');
    default:
      break;
  }
};

const getCardImageMessage = async () => {
  const cards = [];
  let n = Math.round(Math.random());
  n = [3, 5][n];
  for (let i = 0; i < n; i += 1) {
    cards.push({
      header: {
        type: 'image',
        image: {
          url: `${sampleJpegImages[Math.floor(Math.random() * (sampleJpegImages.length))]}`,
          body: 'Wallpaper',
        },
      },
      body: {
        title: 'Sample Card Body Title',
        subtitle: 'Sample Subtitle',
      },
    });
  }
  return new Card(cards);
};

const getCardVideoStreamMessage = async () => {
  const cards = [];
  let n = Math.round(Math.random());
  n = [3, 5][n];
  for (let i = 0; i < n; i += 1) {
    const videoStreamPayload = sampleM3u8Videos[Math.floor(Math.random() * (sampleM3u8Videos.length))];
    cards.push({
      header: {
        type: 'video_stream',
        video_stream: {
          protocol: videoStreamPayload.protocol,
          url: videoStreamPayload.url,
          thumbnail: videoStreamPayload.thumbnail,
          title: 'Sample Video Stream',
        },
      },
      body: {
        title: 'Sample Card Body Title',
        subtitle: 'Sample Subtitle',
      },
    });
  }
  return new Card(cards);
};

const getCardButton = async (omitKey, url = null, allowWebsiteDownloads = null) => {
  const cards = [];
  let n = Math.round(Math.random());
  n = [3, 5][n];
  for (let i = 0; i < n; i += 1) {
    cards.push({
      header: {
        type: 'image',
        image: {
          url: `${sampleJpegImages[Math.floor(Math.random() * (sampleJpegImages.length))]}`,
          body: 'Wallpaper',
        },
      },
      body: {
        title: 'Sample Card Body Title',
        subtitle: 'Sample Subtitle',
      },
      actions: [
        {
          button_text: 'Button Body',
          type: 'website',
          website: {
            title: 'Sample Title',
            ...(omitKey === null || omitKey !== 'payload') && {
              payload: 'Sample Payload',
            },
            url: url || `${sampleIframeLinks[Math.floor(Math.random() * (sampleIframeLinks.length))]}`,
            ...(allowWebsiteDownloads !== null) && {
              allow_website_downloads: allowWebsiteDownloads,
            },
          },
        },
      ],
    });
  }
  return new Card(cards);
};


const getCardAction = async (value, typeMessage) => {
  const cards = [];
  let n = Math.round(Math.random());
  n = [3, 5][n];
  for (let i = 0; i < n; i += 1) {
    const cardObj = {
      header: {
        type: 'text',
        text: {
          body: `${sampleYoutubeVideos[Math.floor(Math.random() * (sampleYoutubeVideos.length))]}`,
        },
      },
      body: {
        title: 'Sample Card Body Title',
        subtitle: 'Sample Card Subtitle',
      },
      actions: [
        {
          button_text: 'Button Body',
          type: `${typeMessage}`,
        },
      ],
    };
    cardObj.actions[0][typeMessage] = value;
    cards.push(cardObj);
  }
  return new Card(cards);
};
const getCardMessage = async (ratingType = null) => {
  const cards = [];
  let n = Math.round(Math.random());
  n = [3, 5][n];
  for (let i = 0; i < n; i += 1) {
    cards.push({
      header: {
        type: 'text',
        text: {
          body: `${sampleYoutubeVideos[Math.floor(Math.random() * (sampleYoutubeVideos.length))]}`,
        },
      },
      body: {
        title: 'Sample Card Body Title',
        subtitle: 'Sample Subtitle',
      },
    });
  }
  return new Card(cards, ratingType);
};

const getArticleImageMessage = async () => {
  const articles = [];
  let n = Math.round(Math.random());
  n = [5, 8][n];
  for (let i = 0; i < n; i += 1) {
    articles.push({
      header: {
        type: 'image',
        image: {
          url: `${sampleJpegImages[Math.floor(Math.random() * (sampleJpegImages.length))]}`,
          body: 'Wallpaper',
        },
      },
      title: 'Sample Title',
      description: sampleDescription,
      tags: [
        'Sample Tag 1',
      ],
    });
  }
  return new Article(articles);
};

const getArticleButton = async (omitKey, url = null, allowWebsiteDownloads) => {
  const articles = [];
  let n = Math.round(Math.random());
  n = [5, 8][n];
  for (let i = 0; i < n; i += 1) {
    articles.push({
      ...(omitKey === null || omitKey !== 'header') && {
        header: {
          type: 'image',
          image: {
            url: `${sampleJpegImages[Math.floor(Math.random() * (sampleJpegImages.length))]}`,
            body: 'Wallpaper',
          },
        },
      },
      title: 'Sample Title',
      description: sampleDescription,
      ...(omitKey === null || omitKey !== 'tags') && {
        tags: [
          'Sample Tag 1',
        ],
      },
      actions: [
        {
          button_text: 'Button Body',
          type: 'website',
          website: {
            title: 'Sample Title',
            ...(omitKey === null || omitKey !== 'payload') && {
              payload: 'Sample Payload',
            },
            url: url || `${sampleIframeLinks[Math.floor(Math.random() * (sampleIframeLinks.length))]}`,
            ...(allowWebsiteDownloads !== null) && {
              allow_website_downloads: allowWebsiteDownloads,
            },
          },
        },
      ],
    });
  }
  return new Article(articles);
};

const getArticleAction = async (value, typeMessage) => {
  const articles = [];
  let n = Math.round(Math.random());
  n = [5, 8][n];
  for (let i = 0; i < n; i += 1) {
    const articleObj = {
      header: {
        type: 'image',
        image: {
          body: 'sample Image',
          url: `${sampleJpegImages[Math.floor(Math.random() * (sampleJpegImages.length))]}`,
        },
      },
      title: 'Sample Title',
      description: 'Sample Description',
      tags: [
        'Science',
      ],
      actions: [
        {
          button_text: 'Button Body',
          type: `${typeMessage}`,
        },
      ],
    };
    articleObj.actions[0][typeMessage] = value;
    articles.push(articleObj);
  }
  return new Article(articles);
};

const getArticleMessage = async (ratingType = null) => {
  const articles = [];
  let n = Math.round(Math.random());
  n = [5, 8][n];
  for (let i = 0; i < n; i += 1) {
    articles.push({
      header: {
        type: 'text',
        text: {
          body: `${sampleYoutubeVideos[Math.floor(Math.random() * (sampleYoutubeVideos.length))]}`,
        },
      },
      title: 'Sample Title',
      description: sampleDescription,
      tags: [
        'Sample Tag 1',
      ],
    });
  }
  return new Article(articles, ratingType);
};

const getActionMessage = async (omitKey, url = null, allowWebsiteDownloads) => {
  const actions = [];
  let n = Math.round(Math.random());
  n = [3, 5][n];
  for (let i = 0; i < n; i += 1) {
    actions.push({
      button_text: 'Button Body',
      type: 'website',
      website: {
        title: 'Sample Title',
        ...(omitKey === null || omitKey !== 'payload') && {
          payload: 'Sample Payload',
        },
        url: url || `${sampleIframeLinks[Math.floor(Math.random() * (sampleIframeLinks.length))]}`,
        ...(allowWebsiteDownloads !== null) && {
          allow_website_downloads: allowWebsiteDownloads,
        },
      },
    });
  }
  return new Action(new Text('Sample Text'), actions);
};

const getActionPhone = async (value, typeMessage) => {
  const actions = [];
  let n = Math.round(Math.random());
  n = [3, 5][n];
  for (let i = 0; i < n; i += 1) {
    const actionObj = {
      button_text: 'Button Body',
      type: `${typeMessage}`,
    };
    actionObj[typeMessage] = value;
    actions.push(actionObj);
  }
  return new Action(new Text('Sample Text'), actions);
};


const getActionImageMessage = async (ratingType = null) => {
  const actions = [];
  let n = Math.round(Math.random());
  n = [3, 5][n];
  for (let i = 0; i < n; i += 1) {
    actions.push({
      button_text: 'Button Body',
      type: 'website',
      website: {
        title: 'Sample Title',
        payload: 'Sample Payload',
        url: `${sampleIframeLinks[Math.floor(Math.random() * (sampleIframeLinks.length))]}`,
      },
    });
  }
  return new Action(new ImageText(`${sampleJpegImages[Math.floor(Math.random() * (sampleJpegImages.length))]}`, 'Sample Text', 'image/jpeg'), actions, ratingType);
};

const getCatalogListMessage = async (environment, bodyType) => {
  const catalogs = [];
  const body = bodyType === 'text' ? {
    type: 'text',
    text: {
      body: 'Sample Body',
    },
  } : {
    type: 'image',
    image: {
      url: `${sampleJpegImages[Math.floor(Math.random() * (sampleJpegImages.length))]}`,
      body: 'Wallpaper',
    },
  };
  let n = Math.round(Math.random());
  n = [3, 5][n];
  const catalogUuidList = (sampleCatalogListUuid.find(o => o.env === environment)).catalogUuid;
  for (let i = 0; i < n; i += 1) {
    catalogs.push({
      id: `${catalogUuidList[Math.floor(Math.random() * (catalogUuidList.length))]}`,
      name: 'Test Catalog List',
      icon: {
        url: `${sampleJpegImages[Math.floor(Math.random() * (sampleJpegImages.length))]}`,
      },

    });
  }
  return new CatalogList(body, catalogs);
};

const getProductListMessage = async (environment, listType) => {
  const catalogUuidList = (sampleCatalogListUuid.find(o => o.env === environment)).catalogUuid;
  const catalogUuid = catalogUuidList[Math.floor(Math.random() * (catalogUuidList.length))];
  const catalog = await getCatalogfromId(catalogUuid, environment);
  let products;
  if (listType === 'multiple') {
    products = catalog.products.slice(0, 5);
    products = products.map((product) => {
      if (product.filter_values) delete product.filter_values;
      product.catalog_id = catalogUuid;
      if (product.customization_steps && product.customization_steps.length && product.customization_steps[0].customizations.length) {
        product.suggested_customizations = [
          {
            id: product.customization_steps[0].customizations[0].id,
            value: [product.customization_steps[0].customizations[0].options[0].id],
          },
        ];
      }
      return product;
    });
  } else {
    products = catalog.products[0];
    if (products.filter_values) delete products.filter_values;
    products.catalog_id = catalogUuid;
    if (products.customization_steps && products.customization_steps.length && products.customization_steps[0].customizations.length) {
      products.suggested_customizations = [
        {
          id: products.customization_steps[0].customizations[0].id,
          value: [products.customization_steps[0].customizations[0].options[0].id],
        },
      ];
    }
    products = [products];
  }
  return new ProductList(products);
};

const getCart = async (environment) => {
  const catalogUuidList = (sampleCatalogListUuid.find(o => o.env === environment)).catalogUuid;
  const catalogUuid = catalogUuidList[Math.floor(Math.random() * (catalogUuidList.length))];
  const catalog = await getCatalogfromId(catalogUuid, environment);
  const products = catalog.products.slice(0, 5);
  const cart = products.map((product) => {
    const cartProduct = {
      product_id: product.id,
      catalog_id: catalogUuid,
      quantity: 2,
    };
    if (product.customization_steps && product.customization_steps.length && product.customization_steps[0].customizations.length) {
      cartProduct.customizations = [
        {
          id: product.customization_steps[0].customizations[0].id,
          value: [product.customization_steps[0].customizations[0].options[0].id],
        },
      ];
    }
    return cartProduct;
  });
  return cart;
};

const getAvailableMessageTypes = () => {
  const availableMessageTypes = {
    text: new Text('This is a sample text message'),
    text_rating_thumb: new Text('This is a sample text message', 'thumb'),
    text_rating_star: new Text('This is a sample text message', 'star'),
    text_youtube: new Text(`${sampleYoutubeVideos[Math.floor(Math.random() * (sampleYoutubeVideos.length))]}`),
    text_csv: new Document(`${sampleCsvFiles[Math.floor(Math.random() * (sampleCsvFiles.length))]}`, 'Sample Csv Text', null),
    text_csv_rating_thumb: new Document(`${sampleCsvFiles[Math.floor(Math.random() * (sampleCsvFiles.length))]}`, 'Sample Csv Text', null, 'thumb'),
    text_csv_rating_star: new Document(`${sampleCsvFiles[Math.floor(Math.random() * (sampleCsvFiles.length))]}`, 'Sample Csv Text', null, 'star'),
    document_pdf: new Document(`${samplePdfDocuments[Math.floor(Math.random() * (samplePdfDocuments.length))]}`, 'Sample PDF Text', null),
    document_pdf_rating_thumb: new Document(`${samplePdfDocuments[Math.floor(Math.random() * (samplePdfDocuments.length))]}`, 'Sample PDF Text', null, 'thumb'),
    document_pdf_rating_star: new Document(`${samplePdfDocuments[Math.floor(Math.random() * (samplePdfDocuments.length))]}`, 'Sample PDF Text', null, 'star'),
    document_pdf_read_only_true: new Document(`${samplePdfDocuments[Math.floor(Math.random() * (samplePdfDocuments.length))]}`, 'Sample PDF Text', null, 'thumb', true),
    document_pdf_read_only_false: new Document(`${samplePdfDocuments[Math.floor(Math.random() * (samplePdfDocuments.length))]}`, 'Sample PDF Text', null, 'star', false),
    document_docx: new Document(`${sampleDocxDocuments[Math.floor(Math.random() * (sampleDocxDocuments.length))]}`, 'Sample Docx Text', null),
    document_docx_read_only_true: new Document(`${sampleDocxDocuments[Math.floor(Math.random() * (sampleDocxDocuments.length))]}`, 'Sample Docx Text', null, 'thumb', true),
    document_docx_read_only_false: new Document(`${sampleDocxDocuments[Math.floor(Math.random() * (sampleDocxDocuments.length))]}`, 'Sample Docx Text', null, 'star', false),
    document_xlsx: new Document(`${sampleXlsxDocuments[Math.floor(Math.random() * (sampleXlsxDocuments.length))]}`, 'Sample Xlsx Text', null),
    document_xlsx_rating_thumb: new Document(`${sampleXlsxDocuments[Math.floor(Math.random() * (sampleXlsxDocuments.length))]}`, 'Sample Xlsx Text', null, 'thumb'),
    document_xlsx_rating_star: new Document(`${sampleXlsxDocuments[Math.floor(Math.random() * (sampleXlsxDocuments.length))]}`, 'Sample Xlsx Text', null, 'star'),
    document_xls: new Document(`${sampleXlsDocuments[Math.floor(Math.random() * (sampleXlsDocuments.length))]}`, 'Sample Xls Text', null),
    document_xls_rating_thumb: new Document(`${sampleXlsDocuments[Math.floor(Math.random() * (sampleXlsDocuments.length))]}`, 'Sample Xls Text', null, 'thumb'),
    document_xls_rating_star: new Document(`${sampleXlsDocuments[Math.floor(Math.random() * (sampleXlsDocuments.length))]}`, 'Sample Xls Text', null, 'star'),
    image_png: new ImageText(`${samplePngImages[Math.floor(Math.random() * (samplePngImages.length))]}`, 'Sample Png image', 'image/png'),
    image_gif: new ImageText(`${sampleGifImages[Math.floor(Math.random() * (sampleGifImages.length))]}`, 'Sample Gif image', 'image/gif'),
    image_jpeg: new ImageText(`${sampleJpegImages[Math.floor(Math.random() * (sampleJpegImages.length))]}`, 'Sample Jpeg', 'image/jpeg'),
    image_jpeg_rating_thumb: new ImageText(`${sampleJpegImages[Math.floor(Math.random() * (sampleJpegImages.length))]}`, 'Sample Jpeg', 'image/jpeg', 'thumb'),
    image_jpeg_rating_star: new ImageText(`${sampleJpegImages[Math.floor(Math.random() * (sampleJpegImages.length))]}`, 'Sample Jpeg', 'image/jpeg', 'star'),
    video_mp4: new Video(`${sampleMp4Videos[Math.floor(Math.random() * (sampleMp4Videos.length))]}`, 'Sample mp4 Video'),
    video_mp4_rating_thumb: new Video(`${sampleMp4Videos[Math.floor(Math.random() * (sampleMp4Videos.length))]}`, 'Sample mp4 Video', 'thumb'),
    video_mp4_rating_star: new Video(`${sampleMp4Videos[Math.floor(Math.random() * (sampleMp4Videos.length))]}`, 'Sample mp4 Video', 'star'),
    video_3gp: new Video(`${sample3gpVideos[Math.floor(Math.random() * (sample3gpVideos.length))]}`, 'Sample 3gp Video'),
    audio_ogg: new Audio(`${sampleOggAudios[Math.floor(Math.random() * (sampleOggAudios.length))]}`, 'Sample Audio Title', 'Sample Ogg Audio Body'),
    audio_mpeg: new Audio(`${sampleMpegAudios[Math.floor(Math.random() * (sampleMpegAudios.length))]}`, 'Sample Audio Title', 'Sample Mpeg Audio Body'),
    audio_mpeg_rating_thumb: new Audio(`${sampleMpegAudios[Math.floor(Math.random() * (sampleMpegAudios.length))]}`, 'Sample Audio Title', 'Sample Mpeg Audio Body', 'thumb'),
    audio_mpeg_rating_star: new Audio(`${sampleMpegAudios[Math.floor(Math.random() * (sampleMpegAudios.length))]}`, 'Sample Audio Title', 'Sample Mpeg Audio Body', 'star'),
    contacts: new Contacts(contacts),
    button_no_reply: new Button(new Text('There will be no response from the bot when the user answers this question.'), buttonsNoReply),
    button_icon_10: new Button(new Text('Sample Text'), buttonsIcon10),
    button_icon_25: new Button(new Text('Sample Text'), buttonsIcon25),
    button_10: new Button(new Text('Sample Text'), buttons10),
    button_25: new Button(new Text('Sample Text'), buttons25),
    button_10_rating_thumb: new Button(new Text('Sample Text'), buttons10, null, null, 'thumb'),
    button_10_rating_star: new Button(new Text('Sample Text'), buttons10, null, null, 'star'),
    button_grid_3: new Button(new Text('Sample Text'), buttonGrid3),
    button_grid_2: new Button(new Text('Sample Text'), buttonGrid2),
    button_grid_1: new Button(new Text('Sample Text'), buttonGrid1),
    button_classes: new Button(new Text('Sample Text'), buttonsClasses),
    button_custom_response_true: new Button(new Text('Sample Text'), buttonGrid3, true),
    button_custom_response_false: new Button(new Text('Sample Text'), buttonGrid2, false),
    button_ttl: new Button(new Text('Sample Text'), buttonGrid2, true, 300),
    button_image: new Button(new ImageText(`${sampleJpegImages[Math.floor(Math.random() * (sampleJpegImages.length))]}`, 'Sample Text', 'image/jpeg'), buttonsIcon10),
    multi_select_button: new MultiSelectButton(multiSelectButton),
    multi_select_button_rating_thumb: new MultiSelectButton(multiSelectButton, 'thumb'),
    multi_select_button_rating_star: new MultiSelectButton(multiSelectButton, 'star'),
    multi_select_button_image_10: new MultiSelectButton(multiSelectButtonImageIcons10),
    multi_select_button_image_15: new MultiSelectButton(multiSelectButtonImageIcons15),
    multi_select_button_custom_response_true: new MultiSelectButton(multiSelectButtonCustomResponseTrue),
    multi_select_button_custom_response_false: new MultiSelectButton(multiSelectButtonCustomResponseFalse),
    multi_select_button_ttl: new MultiSelectButton(multiSelectButtonTtl),
    location: new Location(location),
    location_with_name: new Location(locationWithName),
    location_with_address: new Location(locationWithAddress),
    location_with_name_and_address: new Location(locationWithNameAndAddress),
    location_with_name_and_address_rating_thumb: new Location(locationWithNameAndAddress, 'thumb'),
    location_with_name_and_address_rating_star: new Location(locationWithNameAndAddress, 'star'),
    rich_input_facial_recognition_multi_face_capture: new RichInput(richInputFacialRecognition({ multi_face_capture: true, image_count: 3, location_required: false })),
    rich_input_facial_recognition_location_required: new RichInput(richInputFacialRecognition({ multi_face_capture: false, image_count: 1, location_required: true })),
    rich_input_facial_recognition_single_image: new RichInput(richInputFacialRecognition({ multi_face_capture: true, image_count: 1, location_required: true })),
    rich_input_facial_recognition_multi_image: new RichInput(richInputFacialRecognition({ multi_face_capture: false, image_count: 3, location_required: false })),
    rich_input_date: new RichInput(richInputDate),
    rich_input_default_date: new RichInput(richInputDefaultDate),
    rich_input_min_date: new RichInput(richInputMinDate),
    rich_input_max_date: new RichInput(richInputMaxDate),
    rich_input_location_custom: new RichInput(richInputLocationCustom),
    rich_input_location_allow_address: new RichInput(richInputLocationAllowAddress),
    rich_input_location_forbid_address: new RichInput(richInputLocationForbidAddress),
    video_stream: new VideoStream(sampleM3u8Videos[Math.floor(Math.random() * (sampleM3u8Videos.length))], 'Sample Video Stream'),
    video_stream_rating_thumb: new VideoStream(sampleM3u8Videos[Math.floor(Math.random() * (sampleM3u8Videos.length))], 'Sample Video Stream', 'thumb'),
    video_stream_rating_star: new VideoStream(sampleM3u8Videos[Math.floor(Math.random() * (sampleM3u8Videos.length))], 'Sample Video Stream', 'star'),
  };
  return availableMessageTypes;
};

const getUserMessage = async (messageType, messageBody, invalidButtons) => {
  if (messageType === 'text') {
    return messageBody.text.body;
  } if (messageType === 'button_response') {
    if (messageBody.button_response.body === 'No reply') {
      return 'no_reply';
    } if (invalidButtons.some(button => button.reply === messageBody.button_response.body)) {
      return messageBody.button_response.body;
    }
    return 'Received button response message';
  } if (messageType === 'multi_select_button_response') {
    return 'Received multi select button response message';
  } if (messageType === 'persistent_menu_response') {
    return 'Received persistent menu response message';
  } if (messageType === 'image') {
    return 'Received image response message';
  } if (messageType === 'document') {
    return 'Received document response message';
  } if (messageType === 'video') {
    return 'Received video response message';
  } if (messageType === 'audio') {
    return 'Received audio response message';
  } if (messageType === 'date') {
    return 'Received date response message';
  } if (messageType === 'location') {
    return 'Received location message';
  } if (messageType === 'cart') {
    return 'Received cart message';
  } if (messageType === 'cart_update') {
    return 'Received Cart Update Notification';
  } if (messageType === 'user_session') {
    return 'Successfully started a new session';
  } if (messageType === 'message_rated') {
    return 'Received Message Rating Notification';
  } if (messageType === 'media_list') {
    return 'Received media list message';
  } if (messageType === 'facial_recognition') {
    return 'Received facial recognition response message';
  }
};

module.exports = {
  getMessagePayload,
  getCardImageMessage,
  getCardVideoStreamMessage,
  getCardMessage,
  getCardButton,
  getArticleImageMessage,
  getArticleButton,
  getArticleMessage,
  getActionMessage,
  getActionImageMessage,
  getCatalogListMessage,
  getProductListMessage,
  getCart,
  getCardAction,
  getArticleAction,
  getActionPhone,
  getAvailableMessageTypes,
  getUserMessage,
};
