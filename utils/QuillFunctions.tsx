/*
 * Copyright © 2023-2024 Rohit Parihar and Bloggios
 * All rights reserved.
 * This software is the property of Rohit Parihar and is protected by copyright law.
 * The software, including its source code, documentation, and associated files, may not be used, copied, modified, distributed, or sublicensed without the express written consent of Rohit Parihar.
 * For licensing and usage inquiries, please contact Rohit Parihar at rohitparih@gmail.com, or you can also contact support@bloggios.com.
 * This software is provided as-is, and no warranties or guarantees are made regarding its fitness for any particular purpose or compatibility with any specific technology.
 * For license information and terms of use, please refer to the accompanying LICENSE file or visit http://www.apache.org/licenses/LICENSE-2.0.
 * Unauthorized use of this software may result in legal action and liability for damages.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 */

import {QuillData} from "@/interfaces/QuillData";
import {dispatchErrorMessage} from "@/utils/DispatchFunctions";
import {Dispatch} from "redux";
import {countWords} from "@/utils/StringUtils";

export const Base64URItoMultipartFile = (base64URI: any, fileName: any) => {
    const base64Content = base64URI.split(';base64,').pop();
    const byteCharacters = atob(base64Content);
    const arrayBuffer = new ArrayBuffer(byteCharacters.length);
    const byteArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], {type: Base64URItoMultipartFile.extractContentType(base64URI)});
    return new File([blob], fileName, {type: blob.type});
};

Base64URItoMultipartFile.extractContentType = (base64URI: any) => {
    const contentTypeRegex = /^data:(.+);base64,/; // Regex to extract content type
    const matches = base64URI.match(contentTypeRegex);

    if (matches && matches.length > 1) {
        console.log(matches[1]);
        return matches[1];
    } else {
        return '';
    }
};

export const getHtmlContent = (editorContent: QuillData, dispatch: Dispatch) => {
    if (!editorContent.html && editorContent.html.length === 0) {
        dispatchErrorMessage(dispatch, "Please add Blog Body");
    } else {
        console.log("Debug")
        const delta = editorContent.delta;
        const html = editorContent.html;
        let blobs: Blob[] = [];
        let imageTags: any[] = [];
        if (delta?.ops) {
            delta.ops.forEach((op, index) => {
                if (op.insert && op.insert.image) {
                    const imageTag = op.insert.image;
                    const [, contentType, base64Data] = imageTag.match(/^data:(.*?);base64,(.*)$/);
                    const splitElement = contentType.split('/')[1];
                    if (!splitElement) {
                        dispatchErrorMessage(dispatch, 'One of the Uploaded Image not Corrupted or not Valid');
                        return;
                    }
                    blobs.push(Base64URItoMultipartFile(imageTag, `random.${splitElement}`));
                    imageTags.push(imageTag);
                }
            });
        }
        let finalHtml = html;
        imageTags.map((tag, index) => {
            finalHtml = finalHtml.replaceAll(tag, `bloggios-editor-image-index${index}`);
        });
        return {
            finalHtml: finalHtml,
            blobs: blobs,
            text: editorContent.text,
            delta: editorContent.delta
        }
    }
}

// export const validateHtmlContent = (htmlContent: QuillEditorHtmlBlobContent, dispatch: Dispatch, validationFor: string) => {
//     if (htmlContent.text) {
//         const text = htmlContent.text;
//         const words = text.split(/\s+|\\n/);
//         const filteredWords = words.filter(word => word.trim() !== '');
//         if (filteredWords.length > 400) {
//             dispatchErrorMessage(dispatch, `${validationFor} details cannot contains more than 400 Words`);
//             return false;
//         }
//     }
//     if (htmlContent.blobs) {
//         const imageBlobs = htmlContent.blobs;
//         if (htmlContent.blobs.length > 4) {
//             dispatchErrorMessage(dispatch, `You can only add upto 5 Images in ${validationFor} Details`);
//             return false;
//         }
//         for (let i = 0; i < imageBlobs.length; i++) {
//             const blob = imageBlobs[i];
//             if (blob.size > 800 * 1024) { // Convert KB to bytes
//                 dispatchErrorMessage(dispatch, 'Image size should be less than 1MB');
//                 return false;
//             }
//         }
//     }
//     return true;
// }

export const validateBlogData = (blogData: any, dispatch: Dispatch, topics: any) => {
    // Validate Title
    const title = blogData.title;
    if (title.length === 0) {
        dispatchErrorMessage(dispatch, "Please add title for your Blog");
        return false;
    } else if (title.length > 150) {
        dispatchErrorMessage(dispatch, "Title must be less than 150 Characters");
        return false;
    }
    const words = countWords(title);
    if (words > 25) {
        dispatchErrorMessage(dispatch, "Title must be less than 25 Words");
        return false;
    }

    // Validate Details Text
    const detailsText = blogData.detailsText;
    if (detailsText.length === 0) {
        dispatchErrorMessage(dispatch, "Blog must have a Valid Body");
        return false;
    }

    // Validate Images
    const images = blogData.images;
    if (images && images.length > 0) {
        if (images.length > 10) {
            dispatchErrorMessage(dispatch, `You can only add upto 10 Images in Blog Details`);
            return false;
        }
        for (let i = 0; i < images.length; i++) {
            const blob = images[i];
            if (blob.size > 1000 * 1024) { // Convert KB to bytes
                dispatchErrorMessage(dispatch, 'Image size should be less than 1MB');
                return false;
            }
        }
    }

    const selectedTopics = blogData.topics;
    if (selectedTopics.length > 0) {
        const missingElements = selectedTopics
            .filter((topic: any) =>
                !topics.some((item: any) => item.tag === topic)
            );
        if (missingElements.length > 0) {
            dispatchErrorMessage(dispatch, `${missingElements.join(', ')} is not a valid Topic`);
            return false;
        }
        if (selectedTopics.length > 5) {
            dispatchErrorMessage(dispatch, 'Topics should be less than 5');
            return false;
        }
    }
    return true;
}