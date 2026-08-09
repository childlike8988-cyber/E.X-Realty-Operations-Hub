import type {CreativeContext, CreativeTemplate, ImageGenerationRequest, MockImageGenerationResponse} from './types';
import {getCreditCost} from './credits';

const escapeXml = (value:string) => value.replace(/[&<>'"]/g,(character) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&apos;','"':'&quot;'}[character] ?? character));

export function createImageGenerationRequest(context:CreativeContext, template:CreativeTemplate):ImageGenerationRequest {
  return {prompt:context.imagePromptDraft,referenceImages:[],style:context.suggestedVisualStyle,aspectRatio:template.aspectRatio,credits:getCreditCost('FREE_TEMPLATE')};
}

export function createMockImageResponse(request:ImageGenerationRequest, context:CreativeContext, template:CreativeTemplate):MockImageGenerationResponse {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><defs><linearGradient id="g" x1="0" x2="1"><stop stop-color="#091425"/><stop offset="1" stop-color="#1a3c66"/></linearGradient></defs><rect width="1600" height="900" fill="url(#g)"/><circle cx="1320" cy="150" r="260" fill="#f4c96a" opacity=".16"/><text x="100" y="120" fill="#b9d2ff" font-family="Arial" font-size="28" letter-spacing="8">E.X REALTY CREATIVE STUDIO · MOCK</text><text x="100" y="360" fill="white" font-family="Arial" font-size="72" font-weight="700">${escapeXml(context.propertyName)}</text><text x="100" y="440" fill="#f4c96a" font-family="Arial" font-size="38">${escapeXml(template.name)} · ${template.aspectRatio}</text><text x="100" y="780" fill="#cbd5e1" font-family="Arial" font-size="30">Mock Preview Only — No AI image generated</text></svg>`;
  return {id:`mock-image-${template.id}`,status:'MOCK_COMPLETED',request,mockImageDataUrl:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,source:'MOCK'};
}
