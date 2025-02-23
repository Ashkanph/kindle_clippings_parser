import React from "react";
import { saveAs } from 'file-saver';
import './books.css';

const NEW_LINE = '\n';

export class Books extends React.Component {
    constructor(props) {
        super(props);
        this.exportAll = this.exportAll.bind(this)
    }

    exportAll() {
        let result = ""

        this.props.books.forEach(book => {
            result += `${book.header}` + NEW_LINE + NEW_LINE
            result += convertToString(book, this.props.showTime, this.props.showPosition, this.props.insertLineAfterNote)
            result += NEW_LINE + NEW_LINE + NEW_LINE
        })

        var blob = new Blob([result],
            { type: "text/plain;charset=utf-8" });

        saveAs(blob, 'notes.txt')
    }


    render() {
        return (
            <div>
                <div className="mt-5 is-flex is-justify-content-center is-align-items-center">
                    <h3 className="is-size-4">Books</h3>
                    <button onClick={this.exportAll} className="ml-3 button is-rounded is-info is-small">Download</button></div>
                {
                    this.props.books?.map((book, index) => <Book book={book}
                        showTime={this.props.showTime}
                        showPosition={this.props.showPosition}
                        insertLineAfterNote={this.props.insertLineAfterNote}
                        key={`book-${index}`} />
                    )
                }
            </div>
        )
    }
}

function convertToString(book, showTime, showPosition, insertLineAfterNote) {
    var separator = NEW_LINE;
    if (insertLineAfterNote) {
        separator += NEW_LINE;
    }
    return book?.notes.map(
        note => TxtNote(note, showTime, showPosition)
    ).join(separator)
}

const Book = (props) => {
    const [showNote, setShowNote] = React.useState(false);

    const exportTxtFile = e => {
        e.stopPropagation();
        let conversationString = convertToString(props.book,
            props.showTime, props.showPosition, props.insertLineAfterNote)

        var blob = new Blob([conversationString],
            { type: "text/plain;charset=utf-8" });

        saveAs(blob, `${props.book.header} notes.txt`)
    }

    return (
        <div className="book-wrapper">
            <div onClick={(_e) => setShowNote(!showNote)} className="book-header is-flex is-justify-content-center is-align-items-center">
                <div>
                    <b>{props.book?.header}</b> {props.book?.notes.length} highlights.
                </div>

                <span className="ml-3 book-download" title="Download as a txt file" onClick={exportTxtFile}>Download</span>
            </div>

            {
                showNote && 
                props.book?.notes.map((note, index) =>
                    (
                        <>
                            <Note note={note}
                                showTime={props.showTime}
                                showPosition={props.showPosition}
                                key={`note-${index}`}
                                firstChild={index == 0}
                                index={index} />
                            {
                                props.insertLineAfterNote &&
                                <> <br></br> </>
                            }
                        </>
                    )
                )
            }
        </div>
    );
}

function timeToString(time) {
    return time.format("L LTS")
}

function Note(props) {
    return (
        <div className="note ml-2" style={{ maxWidth: "500px", marginTop: props.firstChild ? "15px" : 0 }}>
            <span className="note-index">{Number(props.index)+1}.</span>
            <div>
                <p>{props.note?.text}</p>
                <div className=" is-size-7">
                    {props.showPosition &&
                        <span className="ml-2">
                            <NotePosition note={props.note} />
                        </span>
                    }
                    {props.showTime && props.note?.date &&
                        <span className="ml-2">
                            , {new Intl.DateTimeFormat('en-GB', {
                                dateStyle: 'full',
                                timeStyle: 'long',
                            }).format(props.note?.date)}
                        </span>
                    }
                </div>
            </div>
        </div>
    );
}

function NotePosition(props) {

    return (
        <>
            {props.note.page != null &&
                <>
                    page {props.note?.page}
                </>
            }

            {props.note.position != null &&
                <>
                    position {props.note?.position}
                </>
            }

            {props.note.location_start != null &&
                <>
                    location {props.note?.location_start}

                    {props.note.location_end != null &&
                        <>
                            -{props.note?.location_end}
                        </>
                    }
                </>
            }
        </>
    );
}

function TxtNote(note, showTime, showPosition) {
    var time_block = ""
    if (showTime && note.date) {
        time_block = `${timeToString(note.date)}`
    }

    var position_block = ""
    if (showPosition) {
        if (note.page) {
            position_block += `page ${note.page} `
        }
        if (note.position) {
            position_block += `position ${note.position} `
        }
        if (note.location_start) {
            position_block += `location ${note.location_start}`
            if (note.location_end) {
                position_block += `-${note.location_start}`
            }
        }
    }

    var additional = ""
    if (time_block || position_block) {
        let separator = ""
        if (time_block && position_block) {
            separator = " "
        }

        additional = ` (${position_block}${separator}${time_block})`
    }

    return `${note.text.trim()}${additional}`
}