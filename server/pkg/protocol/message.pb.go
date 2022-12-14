// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: message.proto

package protocol

import (
	fmt "fmt"
	proto "github.com/gogo/protobuf/proto"
	math "math"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.GoGoProtoPackageIsVersion3 // please upgrade the proto package

type Message struct {
	Avatar               string   `protobuf:"bytes,1,opt,name=avatar,proto3" json:"avatar,omitempty"`
	FromUsername         string   `protobuf:"bytes,2,opt,name=fromUsername,proto3" json:"fromUsername,omitempty"`
	From                 string   `protobuf:"bytes,3,opt,name=from,proto3" json:"from,omitempty"`
	To                   string   `protobuf:"bytes,4,opt,name=to,proto3" json:"to,omitempty"`
	Content              string   `protobuf:"bytes,5,opt,name=content,proto3" json:"content,omitempty"`
	ContentType          int32    `protobuf:"varint,6,opt,name=contentType,proto3" json:"contentType,omitempty"`
	Type                 string   `protobuf:"bytes,7,opt,name=type,proto3" json:"type,omitempty"`
	MessageType          int32    `protobuf:"varint,8,opt,name=messageType,proto3" json:"messageType,omitempty"`
	Url                  string   `protobuf:"bytes,9,opt,name=url,proto3" json:"url,omitempty"`
	FileSuffix           string   `protobuf:"bytes,10,opt,name=fileSuffix,proto3" json:"fileSuffix,omitempty"`
	File                 []byte   `protobuf:"bytes,11,opt,name=file,proto3" json:"file,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Message) Reset()         { *m = Message{} }
func (m *Message) String() string { return proto.CompactTextString(m) }
func (*Message) ProtoMessage()    {}
func (*Message) Descriptor() ([]byte, []int) {
	return fileDescriptor_33c57e4bae7b9afd, []int{0}
}
func (m *Message) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Message.Unmarshal(m, b)
}
func (m *Message) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Message.Marshal(b, m, deterministic)
}
func (m *Message) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Message.Merge(m, src)
}
func (m *Message) XXX_Size() int {
	return xxx_messageInfo_Message.Size(m)
}
func (m *Message) XXX_DiscardUnknown() {
	xxx_messageInfo_Message.DiscardUnknown(m)
}

var xxx_messageInfo_Message proto.InternalMessageInfo

func (m *Message) GetAvatar() string {
	if m != nil {
		return m.Avatar
	}
	return ""
}

func (m *Message) GetFromUsername() string {
	if m != nil {
		return m.FromUsername
	}
	return ""
}

func (m *Message) GetFrom() string {
	if m != nil {
		return m.From
	}
	return ""
}

func (m *Message) GetTo() string {
	if m != nil {
		return m.To
	}
	return ""
}

func (m *Message) GetContent() string {
	if m != nil {
		return m.Content
	}
	return ""
}

func (m *Message) GetContentType() int32 {
	if m != nil {
		return m.ContentType
	}
	return 0
}

func (m *Message) GetType() string {
	if m != nil {
		return m.Type
	}
	return ""
}

func (m *Message) GetMessageType() int32 {
	if m != nil {
		return m.MessageType
	}
	return 0
}

func (m *Message) GetUrl() string {
	if m != nil {
		return m.Url
	}
	return ""
}

func (m *Message) GetFileSuffix() string {
	if m != nil {
		return m.FileSuffix
	}
	return ""
}

func (m *Message) GetFile() []byte {
	if m != nil {
		return m.File
	}
	return nil
}

func init() {
	proto.RegisterType((*Message)(nil), "protocol.Message")
}

func init() { proto.RegisterFile("message.proto", fileDescriptor_33c57e4bae7b9afd) }

var fileDescriptor_33c57e4bae7b9afd = []byte{
	// 216 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x54, 0x90, 0xc1, 0x4a, 0xc4, 0x30,
	0x10, 0x86, 0x49, 0x76, 0xb7, 0xdd, 0x9d, 0xad, 0x22, 0x73, 0x90, 0x39, 0x49, 0xe8, 0xa9, 0x27,
	0x2f, 0x3e, 0x87, 0x97, 0xaa, 0x0f, 0x10, 0xcb, 0x44, 0x0a, 0x69, 0x53, 0xd2, 0x54, 0xf4, 0x71,
	0x7c, 0x53, 0xc9, 0xb4, 0x42, 0x3d, 0xe5, 0x9f, 0xef, 0xe3, 0x1f, 0x98, 0xc0, 0xcd, 0xc0, 0xf3,
	0x6c, 0x3f, 0xf8, 0x71, 0x8a, 0x21, 0x05, 0x3c, 0xcb, 0xd3, 0x05, 0x5f, 0xff, 0x68, 0x28, 0x9f,
	0x57, 0x87, 0xf7, 0x50, 0xd8, 0x4f, 0x9b, 0x6c, 0x24, 0x65, 0x54, 0x73, 0x69, 0xb7, 0x09, 0x6b,
	0xa8, 0x5c, 0x0c, 0xc3, 0xdb, 0xcc, 0x71, 0xb4, 0x03, 0x93, 0x16, 0xfb, 0x8f, 0x21, 0xc2, 0x31,
	0xcf, 0x74, 0x10, 0x27, 0x19, 0x6f, 0x41, 0xa7, 0x40, 0x47, 0x21, 0x3a, 0x05, 0x24, 0x28, 0xbb,
	0x30, 0x26, 0x1e, 0x13, 0x9d, 0x04, 0xfe, 0x8d, 0x68, 0xe0, 0xba, 0xc5, 0xd7, 0xef, 0x89, 0xa9,
	0x30, 0xaa, 0x39, 0xb5, 0x7b, 0x94, 0xf7, 0xa7, 0xac, 0xca, 0x75, 0x7f, 0xce, 0xb9, 0xb5, 0x9d,
	0x25, 0xad, 0xf3, 0xda, 0xda, 0x21, 0xbc, 0x83, 0xc3, 0x12, 0x3d, 0x5d, 0xa4, 0x94, 0x23, 0x3e,
	0x00, 0xb8, 0xde, 0xf3, 0xcb, 0xe2, 0x5c, 0xff, 0x45, 0x20, 0x62, 0x47, 0xe4, 0x8e, 0xde, 0x33,
	0x5d, 0x8d, 0x6a, 0xaa, 0x56, 0xf2, 0x7b, 0x21, 0xbf, 0xf5, 0xf4, 0x1b, 0x00, 0x00, 0xff, 0xff,
	0x66, 0x95, 0x5d, 0x82, 0x45, 0x01, 0x00, 0x00,
}
