import { useMemo } from "react";

const Statistics = props => {
    const { books } = props;

    const notesLength = useMemo(() => {
        let len = 0;
        for (const book of books) {
            if (book.notes) {
                len += book.notes.length;
            }
        }
        return len;
    }, [books]);

    return <div className="is-flex is-justify-content-center" style={{marginTop: "15px"}}>
        <span style={{paddingRight: "15px"}}><b>Number of books: </b>{ books.length }</span>
        <span><b>Number of notes: </b>{ notesLength }</span>
    </div>

}

export default Statistics;
