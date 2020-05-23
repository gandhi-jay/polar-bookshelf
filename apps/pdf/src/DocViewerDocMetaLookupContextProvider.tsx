import React from 'react';
import {useDocViewerStore} from "./DocViewerStore";
import {
    DocMetaLookupContext,
    IDocMetaLookupContext
} from "../../../web/js/annotation_sidebar/DocMetaLookupContextProvider";
import {IDStr} from "polar-shared/src/util/Strings";
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

interface IProps {
    readonly children: React.ReactElement;
}

export const DocViewerDocMetaLookupContextProvider = React.memo((props: IProps) => {

    const {docMeta} = useDocViewerStore();

    function lookup(id: IDStr): IDocMeta | undefined {

        if (! docMeta) {
            console.warn("No docMeta currently defined");
            return undefined;
        }

        if (id === docMeta.docInfo.fingerprint) {
            return docMeta;
        }

        console.warn(`DocMeta loaded ${docMeta.docInfo.fingerprint} not ${id}`);
        return undefined;

    }

    const docMetaLookupContext: IDocMetaLookupContext = {
        lookup
    };

    return (
        <DocMetaLookupContext.Provider value={docMetaLookupContext}>
            {props.children}
        </DocMetaLookupContext.Provider>
    );

});
